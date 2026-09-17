/**
 * Working out a jurisdiction's signing key from cards, without learning anything
 * about the people holding them.
 *
 * ECDSA is built so that a signature plus the message it covers narrows the signing
 * key to two candidates. One card therefore gives an ambiguous answer; two cards
 * signed by the same key give two candidate pairs that share exactly one point, and
 * that point is the key. Nothing about the holder is involved in any of it — the
 * inputs are a signature and a hash, and the output is a public key.
 *
 * Two details matter for doing this on someone else's cards.
 *
 * The first is deduplication. Five photographs of the same licence produce the same
 * payload, the same signature and the same candidate pair — which looks like five
 * agreeing cards and is really one. Payloads are hashed and counted once.
 *
 * The second is that agreement is counted, not required. A strict intersection is
 * destroyed by a single odd card, and two kinds of odd card are entirely expected
 * here: a novelty ID, and a genuine older card signed under a retired key. Both are
 * interesting rather than fatal. Tallying votes lets the real key win while a
 * retired key shows up as its own smaller cluster instead of erasing everything.
 */
import { parseAamva } from './aamva';
import type { Card } from './aamva';
import { findSignature, blankedMessage } from './verifyId';
import { decodeAscii85 } from './ascii85';
import { recoverPublicKeys } from './recoverKey';
import { bytesToHex } from './ecdsa';
import { IIN_NAMES } from './aamva';

export interface CardFinding {
  name: string;
  /** Jurisdiction as the card's own IIN reports it. */
  iin: string;
  jurisdiction: string;
  field?: string;
  signatureBytes?: number;
  candidates?: string[];
  /** Distinguishes a second photo of one card from a second card. */
  fingerprint?: string;
  duplicateOf?: string;
  problem?: string;
}

export interface KeyCluster {
  key: string;
  /** How many distinct cards produced this candidate. */
  cards: number;
}

export interface Group {
  iin: string;
  jurisdiction: string;
  field: string;
  cards: number;
  clusters: KeyCluster[];
  /** The single key agreed on by at least two distinct cards, if there is one. */
  settled?: string;
}

/** A short, non-reversible tag for "this is the same card again". */
async function fingerprintOf(card: Card): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', card.bytes as BufferSource);
  return bytesToHex(new Uint8Array(digest)).slice(0, 16);
}

/** Everything one image contributes. Throws nothing; problems come back as text. */
export async function examine(name: string, payload: string): Promise<CardFinding> {
  let card: Card;
  try {
    card = parseAamva(payload);
  } catch (e) {
    return { name, iin: '', jurisdiction: 'unknown', problem: (e as Error).message };
  }
  const base = {
    name,
    iin: card.iin,
    jurisdiction: IIN_NAMES[card.iin] ?? `IIN ${card.iin}`,
    fingerprint: await fingerprintOf(card),
  };

  const signature = findSignature(card);
  if (!signature) {
    // California signs, but as a W3C Verifiable Credential Barcode rather than an
    // Ascii85 ECDSA signature over the blanked record, and there is nothing to
    // recover: the key is already published. Saying "no signature" there would be
    // wrong in a way that undermines the rest of the page.
    return {
      ...base,
      problem:
        card.iin === '636014'
          ? 'California signs, but with a different construction, and it already publishes ' +
            'the key. Nothing to recover here.'
          : 'No signature of the kind this page can use. Either the state does not sign, or ' +
            'this card predates when it started, or it signs some other way — the recovery ' +
            'here assumes the Canadian Bank Note recipe.',
    };
  }

  const element = card.subfiles
    .flatMap((s) => s.elements)
    .find((e) => e.code === signature.field);
  const message = blankedMessage(card, signature.field);
  if (!element || !message) return { ...base, problem: 'The signature field could not be read.' };

  try {
    const candidates = await recoverPublicKeys(decodeAscii85(element.value), message);
    if (!candidates.length) {
      return {
        ...base,
        field: signature.field,
        problem:
          'The signature is well formed but no key recovers from it over this payload, ' +
          'which means this jurisdiction signs something other than the whole blanked ' +
          'record. That is a finding in itself — please send it in.',
      };
    }
    return { ...base, field: signature.field, signatureBytes: signature.bytes, candidates };
  } catch (e) {
    return { ...base, field: signature.field, problem: (e as Error).message };
  }
}

/** Tally candidate keys per jurisdiction, counting each distinct card once. */
export function tally(findings: CardFinding[]): Group[] {
  const groups = new Map<string, Group & { seen: Set<string>; votes: Map<string, number> }>();
  for (const f of findings) {
    if (!f.candidates?.length || !f.field || !f.fingerprint) continue;
    const id = `${f.iin}/${f.field}`;
    let g = groups.get(id);
    if (!g) {
      g = {
        iin: f.iin,
        jurisdiction: f.jurisdiction,
        field: f.field,
        cards: 0,
        clusters: [],
        seen: new Set(),
        votes: new Map(),
      };
      groups.set(id, g);
    }
    if (g.seen.has(f.fingerprint)) continue; // same card photographed twice
    g.seen.add(f.fingerprint);
    g.cards++;
    for (const key of f.candidates) g.votes.set(key, (g.votes.get(key) ?? 0) + 1);
  }

  return [...groups.values()].map((g) => {
    const clusters = [...g.votes]
      .map(([key, cards]) => ({ key, cards }))
      .sort((a, b) => b.cards - a.cards);
    // Two distinct cards landing on the same point by accident would be a 1-in-2^128
    // coincidence, so two agreeing votes is proof rather than evidence.
    const settled = clusters[0]?.cards >= 2 && clusters[0].cards > (clusters[1]?.cards ?? 0)
      ? clusters[0].key
      : undefined;
    return { iin: g.iin, jurisdiction: g.jurisdiction, field: g.field, cards: g.cards, clusters, settled };
  });
}

/** Mark duplicates so the page can say "that is the same card again". */
export function markDuplicates(findings: CardFinding[]): CardFinding[] {
  const first = new Map<string, string>();
  return findings.map((f) => {
    if (!f.fingerprint) return f;
    const seen = first.get(f.fingerprint);
    if (seen) return { ...f, duplicateOf: seen };
    first.set(f.fingerprint, f.name);
    return f;
  });
}

/** Exactly what gets copied out — no card data, no names, no numbers. */
export function report(groups: Group[]): string {
  const lines = ['# recovered signing keys', ''];
  for (const g of groups) {
    lines.push(`${g.jurisdiction} (IIN ${g.iin}), field ${g.field}, ${g.cards} card(s)`);
    for (const c of g.clusters) {
      const mark = c.key === g.settled ? 'CONFIRMED' : c.cards > 1 ? 'agreed' : 'unconfirmed';
      lines.push(`  ${c.key}  ${c.cards} card(s)  ${mark}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}
