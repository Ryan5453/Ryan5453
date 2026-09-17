/**
 * Recovering the public key from a signature.
 *
 * This is the trick the post is built on, and it is not a break of anything: ECDSA
 * is *designed* so that a signature plus the message it covers narrows the signing
 * key to two candidates. Nothing secret leaks — the private key stays private — but
 * the public key, which these jurisdictions decline to publish, falls out of any
 * signed card.
 *
 * Two candidates is not an answer. Two cards signed by the same key give two
 * candidate pairs whose intersection is, in practice, exactly one point. That is how
 * every key in verifyId.ts was found.
 *
 * Everything below is plain affine arithmetic over P-256 with BigInt. It is not fast
 * and does not need to be: a handful of scalar multiplications per card, once.
 */
import { bytesToHex, derToRaw } from './ecdsa';

const P = 2n ** 256n - 2n ** 224n + 2n ** 192n + 2n ** 96n - 1n;
const N = 0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551n;
const B = 0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604bn;
const GX = 0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296n;
const GY = 0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5n;

/** Affine point; `null` is the point at infinity. */
type Point = { x: bigint; y: bigint } | null;

const mod = (a: bigint, m: bigint) => ((a % m) + m) % m;

function modPow(base: bigint, exp: bigint, m: bigint): bigint {
  let r = 1n;
  base = mod(base, m);
  while (exp > 0n) {
    if (exp & 1n) r = (r * base) % m;
    base = (base * base) % m;
    exp >>= 1n;
  }
  return r;
}

/** p and n are both prime, so Fermat gives the inverse without extended Euclid. */
const inv = (a: bigint, m: bigint) => modPow(a, m - 2n, m);

function add(p: Point, q: Point): Point {
  if (!p) return q;
  if (!q) return p;
  if (p.x === q.x) {
    if (mod(p.y + q.y, P) === 0n) return null; // p == -q
    return double(p);
  }
  const l = mod((q.y - p.y) * inv(mod(q.x - p.x, P), P), P);
  const x = mod(l * l - p.x - q.x, P);
  return { x, y: mod(l * (p.x - x) - p.y, P) };
}

function double(p: Point): Point {
  if (!p || p.y === 0n) return null;
  // a = -3 for P-256.
  const l = mod((3n * p.x * p.x - 3n) * inv(mod(2n * p.y, P), P), P);
  const x = mod(l * l - 2n * p.x, P);
  return { x, y: mod(l * (p.x - x) - p.y, P) };
}

function multiply(k: bigint, p: Point): Point {
  let result: Point = null;
  let addend = p;
  k = mod(k, N);
  while (k > 0n) {
    if (k & 1n) result = add(result, addend);
    addend = double(addend);
    k >>= 1n;
  }
  return result;
}

const onCurve = (p: Point) =>
  !!p && mod(p.y * p.y, P) === mod(p.x * p.x * p.x - 3n * p.x + B, P);

/** The two y values for an x, or none if x is not on the curve. */
function lift(x: bigint): bigint[] {
  const alpha = mod(x * x * x - 3n * x + B, P);
  const y = modPow(alpha, (P + 1n) / 4n, P); // p = 3 mod 4
  if (mod(y * y, P) !== alpha) return [];
  return y === 0n ? [y] : [y, P - y];
}

const toBig = (b: Uint8Array) => b.reduce((a, x) => (a << 8n) | BigInt(x), 0n);

function compress(p: Point): string {
  const x = p!.x.toString(16).padStart(64, '0');
  return ((p!.y & 1n) === 0n ? '02' : '03') + x;
}

/**
 * Every public key that could have produced this signature over this message.
 *
 * Returns compressed points as lowercase hex, normally two of them. An empty result
 * means the signature is not a well-formed ECDSA signature over this message at all
 * — which is itself a finding, since it rules out the construction being guessed.
 */
export async function recoverPublicKeys(
  derSignature: Uint8Array,
  message: Uint8Array,
): Promise<string[]> {
  const raw = derToRaw(derSignature);
  const r = toBig(raw.slice(0, 32));
  const s = toBig(raw.slice(32));
  if (r <= 0n || r >= N || s <= 0n || s >= N) return [];

  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', message as BufferSource));
  const z = toBig(digest);

  const rInv = inv(r, N);
  const G: Point = { x: GX, y: GY };
  const found = new Set<string>();

  // x = r, and r + n where that is still below p — the second only happens for about
  // one signature in 2^128, but it costs nothing to be correct about it.
  for (let j = 0n; j < 2n; j++) {
    const x = r + j * N;
    if (x >= P) break;
    for (const y of lift(x)) {
      const R: Point = { x, y };
      if (!onCurve(R)) continue;
      const Q = add(multiply(s, R), multiply(N - mod(z, N), G));
      const key = multiply(rInv, Q);
      if (key && onCurve(key)) found.add(compress(key));
    }
  }
  return [...found];
}

/** Handy when reporting what was hashed. */
export const digestHex = async (message: Uint8Array) =>
  bytesToHex(new Uint8Array(await crypto.subtle.digest('SHA-256', message as BufferSource)));
