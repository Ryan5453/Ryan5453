/**
 * Ascii85 (the Adobe variant), which is how CBN packs the binary signature into a
 * field that has to survive a text-only barcode.
 *
 * Five characters carry four bytes, so a 72-byte ECDSA signature lands in exactly 90
 * characters — which is the length the CBN signature fields actually are.
 * A trailing partial group is padded with 'u' and the extra bytes dropped.
 */

/** Thrown with a human-readable reason; the UI shows these to the reader. */
export class Ascii85Error extends Error {}

export function decodeAscii85(input: string): Uint8Array {
  // Tolerate the optional <~ ~> delimiters and any whitespace the clipboard adds.
  let s = input.trim();
  if (s.startsWith('<~')) s = s.slice(2);
  if (s.endsWith('~>')) s = s.slice(0, -2);
  s = s.replace(/\s+/g, '');

  const out: number[] = [];
  let group: number[] = [];

  const flush = (n: number) => {
    // Pad the partial group to five with the maximum digit, then keep n-1 bytes.
    const padded = [...group];
    while (padded.length < 5) padded.push(84);
    let v = 0;
    for (const d of padded) v = v * 85 + d;
    const bytes = [(v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff];
    out.push(...bytes.slice(0, n - 1));
  };

  for (const ch of s) {
    if (ch === 'z' && group.length === 0) {
      out.push(0, 0, 0, 0);
      continue;
    }
    const code = ch.charCodeAt(0);
    if (code < 33 || code > 117) {
      throw new Ascii85Error(`"${ch}" is not an Ascii85 character`);
    }
    group.push(code - 33);
    if (group.length === 5) {
      flush(5);
      group = [];
    }
  }
  if (group.length === 1) throw new Ascii85Error('truncated Ascii85 group');
  if (group.length > 1) flush(group.length);
  return Uint8Array.from(out);
}
