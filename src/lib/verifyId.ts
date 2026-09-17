/**
 * Signature checking for the jurisdictions whose construction is known.
 *
 * Canadian Bank Note signs the whole payload with the signature field blanked to
 * '0' characters, so verification is: put the placeholder back, SHA-256 the lot,
 * check the DER signature against the jurisdiction's public key. The keys below were
 * recovered by ECDSA public-key recovery from real cards, not published by anyone —
 * which is the point of the post this ships with.
 *
 * California's barcode is signed by a completely different construction — a W3C
 * Verifiable Credential Barcode — and is handled in verifyCalifornia.ts.
 *
 * For everywhere else, the honest answer depends on the card in front of you, not on
 * the state it came from: several jurisdictions sign and simply never published a key.
 * findSignature() looks for one rather than assuming there is none.
 */
import { decodeAscii85 } from './ascii85';
import { verifyP256, hexToBytes } from './ecdsa';
import type { Card } from './aamva';
import { findElement, fromBytes } from './aamva';

export interface Issuer {
  iin: string;
  jurisdiction: string;
  /** Element holding the Ascii85 signature. */
  field: string;
  /**
   * Every compressed P-256 point known to have signed cards for this jurisdiction,
   * newest first.
   *
   * A list rather than one key, because a jurisdiction is not obliged to sign
   * forever with the key it started with. Cards last eight years; vendors change;
   * keys get rotated. A card signed under a retired key is a perfectly valid card,
   * and checking it against one key would report it as a forgery — the worst
   * possible error for this tool to make. Anything not matching any key here is
   * reported as unmatched rather than fake.
   */
  publicKeys: string[];
  vendor: string;
}

export const ISSUERS: Issuer[] = [
  {
    iin: '636001',
    jurisdiction: 'New York',
    field: 'ZNB',
    vendor: 'Canadian Bank Note',
    publicKeys: ['02851d63a281796be0ca11189f03028abf80e032838f83215889b9e708eac16482'],
  },
  {
    iin: '636000',
    jurisdiction: 'Virginia',
    field: 'ZVA',
    vendor: 'Canadian Bank Note',
    publicKeys: ['02d0f2823d63c854566c5da2cb07e114dbad16f874c2422f74806fe3e2f4775f1d'],
  },
];

export type Verdict =
  | { status: 'valid'; issuer: Issuer; signatureBytes: number }
  /** Signed, well-formed, and matching none of the keys known for this issuer. */
  | { status: 'unmatched'; issuer: Issuer; signatureBytes: number; issued?: string }
  | { status: 'malformed'; issuer: Issuer; detail: string }
  | { status: 'missing'; issuer: Issuer }
  | { status: 'unsupported'; jurisdiction: string; detail: string }
  /** The card carries a signature, but nobody has the key to check it. */
  | { status: 'unkeyed'; field: string; signatureBytes: number }
  /** No signature field in this payload. */
  | { status: 'unsigned' };

/**
 * Look for a signature the card is actually carrying, whether or not we can check it.
 *
 * Jurisdictions that sign put the signature in their own subfile, in an element whose
 * code starts with Z, Ascii85-encoded — so a Z element that decodes to a well-formed
 * ECDSA DER sequence is a signature whichever state it came from. That is evidence
 * read off the card, which is the point: this page used to tell everyone outside New
 * York, Virginia and California that their jurisdiction "publishes no barcode
 * signature". That is false. North Carolina, South Carolina and Wisconsin all sign.
 * What none of them publishes is the key.
 */
export function findSignature(card: Card): { field: string; bytes: number } | null {
  for (const sub of card.subfiles) {
    for (const el of sub.elements) {
      if (!el.code.startsWith('Z')) continue;
      const v = el.value.trim();
      // 70-72 bytes of DER is 88-90 Ascii85 characters; allow a little either side.
      if (v.length < 84 || v.length > 96) continue;
      try {
        const der = decodeAscii85(v);
        if (isDerSignature(der)) return { field: el.code, bytes: der.length };
      } catch {
        // Not Ascii85, so not a signature. Just another field.
      }
    }
  }
  return null;
}

/** SEQUENCE { INTEGER r, INTEGER s }, and nothing left over. */
function isDerSignature(d: Uint8Array): boolean {
  if (d.length < 68 || d.length > 80 || d[0] !== 0x30 || d[1] !== d.length - 2) return false;
  if (d[2] !== 0x02) return false;
  const rLen = d[3];
  const sAt = 4 + rLen;
  return d[sAt] === 0x02 && sAt + 2 + d[sAt + 1] === d.length;
}

/** SHA-256 over the payload with the signature value replaced by '0's, in place. */
export function blankedMessage(card: Card, field: string): Uint8Array | null {
  const el = findElement(card, field);
  if (!el) return null;
  const msg = Uint8Array.from(card.bytes);
  msg.fill(0x30, el.valueStart, el.valueEnd); // '0'
  return msg;
}

export async function verifyCard(card: Card): Promise<Verdict> {
  const issuer = ISSUERS.find((i) => i.iin === card.iin);

  if (!issuer) {
    // Only California, by its IIN. An earlier version keyed off a 'ZC' subfile, but
    // that is simply the jurisdiction-specific subfile for a state whose name starts
    // with C — Connecticut has one too, and was being reported as carrying a
    // California credential it does not have.
    if (card.iin === '636014') {
      return {
        status: 'unsupported',
        jurisdiction: 'California',
        detail:
          'This card carries a W3C Verifiable Credential Barcode. California publishes the key ' +
          'to check it, but the construction is CBOR-LD + ecdsa-xi-2023, which this tool does ' +
          'not implement yet.',
      };
    }
    const found = findSignature(card);
    return found
      ? { status: 'unkeyed', field: found.field, signatureBytes: found.bytes }
      : { status: 'unsigned' };
  }

  const el = findElement(card, issuer.field);
  if (!el || !el.value.trim()) return { status: 'missing', issuer };

  let der: Uint8Array;
  try {
    der = decodeAscii85(el.value);
  } catch (e) {
    return { status: 'malformed', issuer, detail: (e as Error).message };
  }
  if (der.length < 68 || der.length > 80 || der[0] !== 0x30) {
    return {
      status: 'malformed',
      issuer,
      detail: `Decoded to ${der.length} bytes, which is not a DER ECDSA signature.`,
    };
  }

  const message = blankedMessage(card, issuer.field);
  if (!message) return { status: 'missing', issuer };

  try {
    for (const key of issuer.publicKeys) {
      if (await verifyP256(hexToBytes(key), der, message)) {
        return { status: 'valid', issuer, signatureBytes: der.length };
      }
    }
    // DBD is the issue date, MMDDCCYY. Worth surfacing: an old card is the most
    // likely innocent explanation for a signature that checks out against nothing.
    const issued = findElement(card, 'DBD')?.value.trim();
    return { status: 'unmatched', issuer, signatureBytes: der.length, issued };
  } catch (e) {
    return { status: 'malformed', issuer, detail: (e as Error).message };
  }
}

/** Handy for showing the reader exactly what was hashed. */
export const previewMessage = (msg: Uint8Array) =>
  fromBytes(msg).replace(/\n/g, '\\n').replace(/\r/g, '\\r');
