/**
 * California's barcode signature, verified here rather than by California.
 *
 * The state does publish a wrapper SDK. This deliberately does not use it: it drives
 * the same underlying, standard libraries directly, so the checks below are ours and
 * can be read. That matters for a tool whose whole point is that a signature you
 * cannot inspect is worth nothing.
 *
 * The construction is nothing like the Canadian Bank Note one. Inside the ZC subfile
 * is a W3C Verifiable Credential Barcode: a credential compressed with CBOR-LD and
 * signed with the ecdsa-xi-2023 cryptosuite, which is ecdsa-rdfc-2019 with "extra
 * information" mixed in — here, a hash of the very AAMVA fields the credential
 * claims to protect. So verification is:
 *
 *   1. base64-decode the ZCE field to CBOR-LD bytes
 *   2. CBOR-LD-decode those to a JSON-LD credential, using California's registry
 *      tables (entry 31000000) — without them the integers do not resolve to URLs
 *   3. read protectedComponentIndex, a bitstring naming which of the 22 mandatory
 *      AAMVA elements are covered
 *   4. select exactly those elements from the barcode and hash them
 *   5. verify the credential's proof with that hash as the extra information
 *
 * WHERE THE SECURITY ACTUALLY LIVES
 *
 * Step 5 proves the credential was signed by whatever key the credential itself
 * points at — which on its own is worth nothing, because anyone can host a DID
 * document and sign their own card. What makes it mean anything is pinning: the
 * issuer and the verification method must be California's DID, a value compiled in
 * here rather than read from the barcode, and key resolution must be confined to
 * California's own hosts. Both are enforced below, before and after the proof check.
 * The spec states this requirement in prose; a verifier that skips it is forgeable by
 * construction.
 */
import { aamva } from '@digitalbazaar/pdf417-dl-canonicalizer';
import { decode as cborldDecode } from '@digitalbazaar/cborld';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import { createCryptosuite } from '@digitalbazaar/ecdsa-xi-2023-cryptosuite';
import { DidWebDriver } from '@digitalbazaar/did-method-web';
import { CachedResolver } from '@digitalbazaar/did-io';
import { JsonLdDocumentLoader } from 'jsonld-document-loader';
import { contexts as vcContexts } from '@digitalbazaar/credentials-context';
import { contexts as vcbContexts } from '@digitalbazaar/vc-barcodes-context';
import * as vc from '@digitalbazaar/vc';

/** Compiled in, never taken from the card. This is the trust anchor. */
export const CA_ISSUER_DID = 'did:web:credentials.dmv.ca.gov';
const CA_ALLOWED_HOSTS = new Set(['credentials.dmv.ca.gov', 'api.credentials.dmv.ca.gov']);

export const CA_INFO = {
  iin: '636014',
  jurisdiction: 'CA',
  subfile: 'ZC',
  field: 'ZCE',
} as const;

/**
 * California's CBOR-LD registry entry. These tables are what let a ~144-byte payload
 * carry a full credential: URLs and context IRIs compress to single integers. A
 * decoder without them produces integers, not a credential.
 */
const contextTable = new Map<string, number>([
  ['https://www.w3.org/ns/credentials/v2', 1],
  ['https://w3id.org/vc-barcodes/v1', 2],
]);
const cryptosuiteTable = new Map<string, number>([['ecdsa-xi-2023', 1]]);
const UAT_DID = 'did:web:uat-credentials.dmv.ca.gov';
const urlTable = new Map<string, number>([
  [CA_ISSUER_DID, 1],
  ['https://api.credentials.dmv.ca.gov/status/dlid/1/status-lists', 2],
  ['https://api.credentials.dmv.ca.gov/status/dlid/2/status-lists', 3],
  ['https://api.credentials.dmv.ca.gov/status/dlid/3/status-lists', 4],
  // Key rotation happens inside the same DID document: vm-vcb-1 .. vm-vcb-15.
  ...Array.from({ length: 15 }, (_, i) => [`${CA_ISSUER_DID}#vm-vcb-${i + 1}`, 5 + i] as [string, number]),
  // The test-environment entries have to be here or a UAT card will not even decode
  // — the integers would not resolve. Decoding one is harmless; *trusting* one is
  // not, and that is a separate decision made by the pin below. Nothing
  // cryptographically distinguishes a UAT card from a real one, so a verifier that
  // accepts both accepts anything signed with a leaked test key.
  [UAT_DID, 20],
  ['https://api.uat-credentials.dmv.ca.gov/status/dlid/1/status-lists', 21],
  ...Array.from({ length: 5 }, (_, i) => [`${UAT_DID}#vm-vcb-${i + 1}`, 22 + i] as [string, number]),
  ['https://api.uat-credentials.dmv.ca.gov/status/dlid/2/status-lists', 27],
  ['https://api.uat-credentials.dmv.ca.gov/status/dlid/3/status-lists', 28],
]);
const typeTable = new Map<string, Map<string, number>>([
  ['https://w3id.org/security#cryptosuiteString', cryptosuiteTable],
  ['context', contextTable],
  ['url', urlTable],
]);

/**
 * A document loader confined to California's hosts. This is half the trust anchor:
 * without it, a credential naming someone else's DID would resolve happily.
 */
function buildLoader(allowedHosts: Set<string> = CA_ALLOWED_HOSTS) {
  const jdl = new JsonLdDocumentLoader();
  // The credential and barcode vocabularies ship with this bundle. They are served
  // from memory and never fetched, which is why they are exempt from the host rule
  // below — blocking them would only break the decode, never stop an attacker.
  const bundled = new Set<string>();
  for (const [url, ctx] of [...vcContexts, ...vcbContexts]) {
    jdl.addStatic(url, ctx);
    bundled.add(url);
  }
  const resolver = new CachedResolver();
  resolver.use(new DidWebDriver());
  jdl.setDidResolver(resolver);
  const loader = jdl.build();

  return async (url: string) => {
    if (bundled.has(url)) return loader(url);
    if (url.startsWith('did:web:')) {
      const host = url.slice('did:web:'.length).split(/[#?]/)[0].split(':')[0];
      if (!allowedHosts.has(decodeURIComponent(host))) {
        throw new Error(`Refusing to resolve a DID outside California: ${host}`);
      }
    } else if (/^https?:/.test(url)) {
      const { hostname } = new URL(url);
      if (!allowedHosts.has(hostname)) {
        throw new Error(`Refusing to load a resource outside California: ${hostname}`);
      }
    }
    return loader(url);
  };
}

export interface CaResult {
  status: 'valid' | 'invalid' | 'absent' | 'error';
  /** Which AAMVA elements the signature actually covers. */
  protectedFields?: string[];
  /** Elements present on the card that the signature does NOT cover. */
  unprotectedFields?: string[];
  verificationMethod?: string;
  detail?: string;
}

/**
 * Dig the real complaint out of a verifier result.
 *
 * The library's top-level message is "Verification error(s).", which tells a reader
 * nothing — and on this page "nothing" reads as "something went wrong with the tool"
 * rather than "this card is not genuine". The specifics are in a nested tree of
 * errors and per-proof results, so walk it and keep the leaves.
 */
function reasonFrom(result: any): string {
  const seen = new Set<string>();
  const walk = (node: any, depth = 0) => {
    if (!node || depth > 6) return;
    if (Array.isArray(node)) return node.forEach((n) => walk(n, depth + 1));
    if (typeof node.message === 'string' && !/^verification error/i.test(node.message)) {
      seen.add(node.message.replace(/\.$/, ''));
    }
    walk(node.errors, depth + 1);
    walk(node.error, depth + 1);
    walk(node.results, depth + 1);
  };
  walk(result.error);
  walk(result.results);
  const leaves = [...seen];
  return leaves.length
    ? `${leaves.join('; ')}.`
    : 'The signature does not match California\u2019s key.';
}

const b64ToBytes = (s: string): Uint8Array => {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

/**
 * The trust anchor, isolated so tests can exercise California's published UAT cards.
 * Production is the only value the application ever passes; exposing a UAT switch in
 * the interface would defeat the entire pin, because a test-environment card is
 * otherwise indistinguishable from a real one.
 */
export interface Anchor {
  did: string;
  hosts: Set<string>;
}
export const PRODUCTION: Anchor = { did: CA_ISSUER_DID, hosts: CA_ALLOWED_HOSTS };

export const verifyCalifornia = (raw: string): Promise<CaResult> => verifyAgainst(raw, PRODUCTION);

export async function verifyAgainst(raw: string, anchor: Anchor): Promise<CaResult> {
  let decoded: any;
  try {
    decoded = aamva.decode({ data: raw, encoding: 'utf8' });
  } catch (e) {
    return { status: 'error', detail: `Could not parse the barcode: ${(e as Error).message}` };
  }

  const zc = decoded.subfiles?.find((s: any) => s.type === CA_INFO.subfile);
  const encodedVcb = zc?.data?.[CA_INFO.field];
  if (!encodedVcb) {
    return {
      status: 'absent',
      detail:
        'No Verifiable Credential Barcode in this card. California has only required one ' +
        'since 29 September 2025, so an older card legitimately has nothing to check.',
    };
  }

  try {
    const credential: any = await cborldDecode({
      cborldBytes: b64ToBytes(encodedVcb),
      documentLoader: buildLoader(anchor.hosts),
      typeTableLoader: () => typeTable,
    });

    // Pin the issuer before doing anything else with it. A signature that verifies
    // against a key the attacker chose is not evidence of anything.
    const issuer = typeof credential.issuer === 'string' ? credential.issuer : credential.issuer?.id;
    if (issuer !== anchor.did) {
      return {
        status: 'invalid',
        detail: `Issuer is "${issuer}", not ${anchor.did}. Rejected without checking the signature.`,
      };
    }
    const vm: string | undefined = credential.proof?.verificationMethod;
    if (!vm || !vm.startsWith(`${anchor.did}#`)) {
      return {
        status: 'invalid',
        detail: `Verification method "${vm}" is not under ${anchor.did}. Rejected.`,
      };
    }

    // The bitstring says which elements are signed. Everything else on the card is
    // not — which is worth showing the reader, because it is where the gaps are.
    const componentIndex = credential.credentialSubject?.protectedComponentIndex;
    const document = await aamva.select({
      object: decoded,
      selector: { subfile: ['DL', 'ID'], componentIndex },
    });
    const protectedFields = [...document.keys()].map(String);
    const dl = decoded.subfiles?.find((s: any) => s.type === 'DL' || s.type === 'ID');
    const unprotectedFields = Object.keys(dl?.data ?? {}).filter((f) => !protectedFields.includes(f));

    const extraInformation = await aamva.hash({ document });
    const suite = new DataIntegrityProof({ cryptosuite: createCryptosuite({ extraInformation }) });

    const verifyResult: any = await vc.verifyCredential({
      credential,
      suite,
      documentLoader: buildLoader(anchor.hosts),
      // Revocation is a separate network call against California's status lists;
      // left off here so a failed status fetch cannot masquerade as a bad signature.
      checkStatus: async () => ({ verified: true }),
    });

    return verifyResult.verified
      ? { status: 'valid', protectedFields, unprotectedFields, verificationMethod: vm }
      : {
          status: 'invalid',
          protectedFields,
          unprotectedFields,
          verificationMethod: vm,
          detail: reasonFrom(verifyResult),
        };
  } catch (e) {
    return { status: 'error', detail: (e as Error).message };
  }
}
