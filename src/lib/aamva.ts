/**
 * A parser for the PDF417 barcode on the back of a North American driver's license,
 * as specified by the AAMVA Card Design Standard.
 *
 * The one thing this does that a normal parser does not is keep byte offsets for
 * every element value. Verifying a CBN signature means blanking the signature field
 * *in place* and hashing the whole payload, so the exact span of that value is not a
 * detail — it is the entire trick.
 *
 * Everything works on bytes rather than a JavaScript string, because the payload is
 * binary-ish (control characters as separators) and an offset that is off by one
 * produces a hash that is wrong with no clue as to why.
 */

export interface Element {
  /** Three-letter AAMVA code, e.g. DCS. */
  code: string;
  value: string;
  /** Byte span of the value within the whole payload. */
  valueStart: number;
  valueEnd: number;
}

export interface Subfile {
  type: string;
  offset: number;
  length: number;
  elements: Element[];
}

export interface Card {
  iin: string;
  aamvaVersion: string;
  jurisdictionVersion: string;
  entryCount: number;
  subfiles: Subfile[];
  bytes: Uint8Array;
}

export class AamvaError extends Error {}

const LF = 0x0a;
const CR = 0x0d;

/** Latin-1 in both directions: one character is one byte, which keeps offsets honest. */
export const toBytes = (s: string): Uint8Array =>
  Uint8Array.from([...s].map((c) => c.charCodeAt(0) & 0xff));
export const fromBytes = (b: Uint8Array): string =>
  [...b].map((x) => String.fromCharCode(x)).join('');

export function parseAamva(input: string): Card {
  const bytes = toBytes(input.replace(/^﻿/, ''));
  const text = fromBytes(bytes);

  // Scanners vary about the leading @, LF, RS, CR, so anchor on the file header.
  const ansi = text.indexOf('ANSI ');
  if (ansi < 0) throw new AamvaError('No "ANSI" file header found — is this an AAMVA barcode?');

  let p = ansi + 5;
  const iin = text.slice(p, p + 6);
  const aamvaVersion = text.slice(p + 6, p + 8);
  const jurisdictionVersion = text.slice(p + 8, p + 10);
  let entryCount = parseInt(text.slice(p + 10, p + 12), 10);
  p += 12;

  // Version 1 has no jurisdiction-version field and no entry count in that position.
  if (!Number.isFinite(entryCount) || entryCount < 1 || entryCount > 20) {
    entryCount = 1;
    p = ansi + 5 + 8;
  }

  const subfiles: Subfile[] = [];
  for (let i = 0; i < entryCount; i++) {
    const d = text.slice(p + i * 10, p + i * 10 + 10);
    if (d.length < 10) break;
    const type = d.slice(0, 2);
    const offset = parseInt(d.slice(2, 6), 10);
    const length = parseInt(d.slice(6, 10), 10);
    if (!Number.isFinite(offset) || !Number.isFinite(length)) continue;
    const at = locateSubfile(text, type, offset, p + entryCount * 10);
    subfiles.push({ type, offset: at, length, elements: parseElements(bytes, at, length) });
  }
  if (!subfiles.length) throw new AamvaError('Header parsed, but it lists no subfiles.');

  return { iin, aamvaVersion, jurisdictionVersion, entryCount, subfiles, bytes };
}

/**
 * Trust the declared offset only if the subfile type is actually there.
 *
 * Encoders get this wrong. One card in the test corpus declares two subfiles but
 * computed both offsets as though the directory held one entry, leaving every offset
 * ten bytes short; real scanners read it anyway. Since the signature covers the
 * payload byte-for-byte as scanned, relocating a subfile changes nothing about what
 * gets hashed — it only decides whether the fields can be found at all.
 */
function locateSubfile(text: string, type: string, declared: number, afterHeader: number): number {
  if (text.slice(declared, declared + 2) === type) return declared;
  const found = text.indexOf(type, afterHeader);
  return found >= 0 ? found : declared;
}

/** Elements are three-letter code + value, separated by LF, the subfile closed by CR. */
function parseElements(bytes: Uint8Array, offset: number, length: number): Element[] {
  const end = Math.min(offset + length, bytes.length);
  let i = offset + 2; // skip the repeated subfile type
  if (bytes[i] === LF) i++;

  const elements: Element[] = [];
  while (i < end) {
    if (bytes[i] === CR) break;
    const code = fromBytes(bytes.slice(i, i + 3));
    const valueStart = i + 3;
    let j = valueStart;
    while (j < end && bytes[j] !== LF && bytes[j] !== CR) j++;
    elements.push({ code, value: fromBytes(bytes.slice(valueStart, j)), valueStart, valueEnd: j });
    i = j + 1;
  }
  return elements;
}

export const findElement = (card: Card, code: string): Element | undefined => {
  for (const s of card.subfiles) {
    const hit = s.elements.find((e) => e.code === code);
    if (hit) return hit;
  }
  return undefined;
};

/** The mandatory set, plus the codes a reader is most likely to care about. */
export const ELEMENT_NAMES: Record<string, string> = {
  DCS: 'Family name', DAC: 'First name', DAD: 'Middle name', DBD: 'Issue date',
  DBB: 'Date of birth', DBA: 'Expiry date', DBC: 'Sex', DAY: 'Eye colour',
  DAU: 'Height', DAG: 'Street address', DAI: 'City', DAJ: 'Jurisdiction',
  DAK: 'Postal code', DAQ: 'License number', DCF: 'Document discriminator',
  DCG: 'Country', DCK: 'Inventory control number', DDE: 'Family name truncation',
  DDF: 'First name truncation', DDG: 'Middle name truncation', DCA: 'Vehicle class',
  DCB: 'Restrictions', DCD: 'Endorsements', DDA: 'Compliance type',
  DDB: 'Card revision date', DDD: 'Limited duration indicator', DAZ: 'Hair colour',
  DAW: 'Weight (lb)', DAX: 'Weight (kg)', DCU: 'Name suffix', DDK: 'Organ donor',
  DDL: 'Veteran indicator', DAH: 'Street address 2', DCL: 'Race / ethnicity',
};

/**
 * Issuer identification numbers, from AAMVA's published IIN registry.
 *
 * An earlier hand-written version of this table had several wrong — it called
 * Connecticut "Pennsylvania" and Texas "Arizona", which is a uniquely bad failure in
 * a tool whose job is telling you what a card is. It was then rebuilt from IINs read
 * out of real barcodes, which agreed with AAMVA on all 47 jurisdictions that corpus
 * covered; but those cards were counterfeits, so agreement was suggestive rather
 * than authoritative. These values come from the registry itself.
 *
 * An unknown IIN is reported as unrecognised rather than guessed.
 */
export const IIN_NAMES: Record<string, string> = {
  '604426': 'Prince Edward Island', '604427': 'American Samoa',
  '604428': 'Quebec', '604429': 'Yukon',
  '604430': 'Northern Mariana Islands', '604431': 'Puerto Rico',
  '604432': 'Alberta', '604433': 'Nunavut',
  '604434': 'Northwest Territories', '636000': 'Virginia',
  '636001': 'New York', '636002': 'Massachusetts',
  '636003': 'Maryland', '636004': 'North Carolina',
  '636005': 'South Carolina', '636006': 'Connecticut',
  '636007': 'Louisiana', '636008': 'Montana',
  '636009': 'New Mexico', '636010': 'Florida',
  '636011': 'Delaware', '636012': 'Ontario',
  '636013': 'Nova Scotia', '636014': 'California',
  '636015': 'Texas', '636016': 'Newfoundland',
  '636017': 'New Brunswick', '636018': 'Iowa',
  '636019': 'Guam', '636020': 'Colorado',
  '636021': 'Arkansas', '636022': 'Kansas',
  '636023': 'Ohio', '636024': 'Vermont',
  '636025': 'Pennsylvania', '636026': 'Arizona',
  '636027': 'State Dept. (Diplomatic)', '636028': 'British Columbia',
  '636029': 'Oregon', '636030': 'Missouri',
  '636031': 'Wisconsin', '636032': 'Michigan',
  '636033': 'Alabama', '636034': 'North Dakota',
  '636035': 'Illinois', '636036': 'New Jersey',
  '636037': 'Indiana', '636038': 'Minnesota',
  '636039': 'New Hampshire', '636040': 'Utah',
  '636041': 'Maine', '636042': 'South Dakota',
  '636043': 'District of Columbia', '636044': 'Saskatchewan',
  '636045': 'Washington', '636046': 'Kentucky',
  '636047': 'Hawaii', '636048': 'Manitoba',
  '636049': 'Nevada', '636050': 'Idaho',
  '636051': 'Mississippi', '636052': 'Rhode Island',
  '636053': 'Tennessee', '636054': 'Nebraska',
  '636055': 'Georgia', '636056': 'Coahuila',
  '636057': 'Hidalgo', '636058': 'Oklahoma',
  '636059': 'Alaska', '636060': 'Wyoming',
  '636061': 'West Virginia', '636062': 'Virgin Islands',
};
