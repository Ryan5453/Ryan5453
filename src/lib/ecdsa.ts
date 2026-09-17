/**
 * Just enough P-256 to check a signature in the browser.
 *
 * WebCrypto will do the verification, but it will not accept either of the shapes an
 * ID actually carries: the public keys published for these jurisdictions are
 * compressed points (33 bytes), and the signature in the barcode is DER. So there are
 * two conversions here and nothing else — no hand-rolled curve arithmetic beyond the
 * square root needed to recover y.
 */

const P = 2n ** 256n - 2n ** 224n + 2n ** 192n + 2n ** 96n - 1n;
const B = 0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604bn;

const toBig = (b: Uint8Array) => b.reduce((a, x) => (a << 8n) | BigInt(x), 0n);

function toBytes(v: bigint, len: number): Uint8Array {
  const out = new Uint8Array(len);
  for (let i = len - 1; i >= 0; i--) {
    out[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return out;
}

function modPow(base: bigint, exp: bigint, m: bigint): bigint {
  let r = 1n;
  base %= m;
  while (exp > 0n) {
    if (exp & 1n) r = (r * base) % m;
    base = (base * base) % m;
    exp >>= 1n;
  }
  return r;
}

/**
 * Compressed point -> uncompressed. p ≡ 3 (mod 4) for P-256, so the square root is
 * a single exponentiation; the leading byte says which of the two roots to keep.
 */
export function decompressP256(point: Uint8Array): Uint8Array {
  if (point.length === 65 && point[0] === 0x04) return point;
  if (point.length !== 33 || (point[0] !== 0x02 && point[0] !== 0x03)) {
    throw new Error('not a compressed P-256 point (expected 33 bytes starting 02 or 03)');
  }
  const x = toBig(point.slice(1));
  const alpha = (modPow(x, 3n, P) - 3n * x + B) % P;
  let y = modPow((alpha + P) % P, (P + 1n) / 4n, P);
  if ((y * y) % P !== (alpha + P) % P) throw new Error('point is not on the P-256 curve');
  if ((y & 1n) !== BigInt(point[0] & 1)) y = P - y;
  const out = new Uint8Array(65);
  out[0] = 0x04;
  out.set(toBytes(x, 32), 1);
  out.set(toBytes(y, 32), 33);
  return out;
}

/** DER SEQUENCE { INTEGER r, INTEGER s } -> the raw r‖s WebCrypto wants. */
export function derToRaw(der: Uint8Array): Uint8Array {
  let i = 0;
  if (der[i++] !== 0x30) throw new Error('signature is not a DER SEQUENCE');
  let len = der[i++];
  if (len & 0x80) {
    const n = len & 0x7f;
    len = 0;
    for (let k = 0; k < n; k++) len = (len << 8) | der[i++];
  }
  const readInt = () => {
    if (der[i++] !== 0x02) throw new Error('expected a DER INTEGER');
    const l = der[i++];
    let v = der.slice(i, i + l);
    i += l;
    while (v.length > 1 && v[0] === 0x00) v = v.slice(1); // drop sign padding
    if (v.length > 32) throw new Error('INTEGER too large for P-256');
    const p = new Uint8Array(32);
    p.set(v, 32 - v.length);
    return p;
  };
  const r = readInt();
  const s = readInt();
  const out = new Uint8Array(64);
  out.set(r, 0);
  out.set(s, 32);
  return out;
}

/** SHA-256 the message, then verify r‖s against the public point. */
export async function verifyP256(
  publicKeyPoint: Uint8Array,
  derSignature: Uint8Array,
  message: Uint8Array,
): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    decompressP256(publicKeyPoint) as BufferSource,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['verify'],
  );
  return crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    derToRaw(derSignature) as BufferSource,
    message as BufferSource,
  );
}

export const hexToBytes = (hex: string): Uint8Array =>
  Uint8Array.from(hex.replace(/\s+/g, '').match(/../g)!.map((h) => parseInt(h, 16)));

export const bytesToHex = (b: Uint8Array): string =>
  [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
