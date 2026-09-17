/**
 * Reading the PDF417 off a photograph of a license.
 *
 * This uses the WebAssembly build of ZXing-C++ rather than the JavaScript port,
 * because a license barcode is dense — New York packs 484 bytes into a strip a
 * couple of centimetres tall, Virginia 559 — and the JS port gives up on images the
 * C++ decoder reads.
 *
 * Even so, one decode attempt is not enough. Against a corpus of 58 scanned card
 * backs, handing ZXing the file as-is reads 45; the rest report `ChecksumError`,
 * meaning the symbol was found and the error correction failed. The usual cause is
 * uneven brightness — a polycarbonate card is glossy, and a scan of one carries a
 * sheen that defeats a single global black/white threshold.
 *
 * So this runs in three acts (see scanBarcode below), and gets to 55 of 58. On a
 * second corpus of real photographs, including phone shots of a card held in the
 * hand, it reads 9 of 18; the analysis of what the other 9 are is at the bottom of
 * this comment, because most of them are not this code's to fix.
 *
 * Two things do the work. **Flat-field correction** removes a lighting gradient
 * while keeping the greys, which is what recovers the signed jurisdictions — New
 * York, Virginia, North Carolina and Wisconsin all failed before it, precisely
 * because their extra ~90 bytes of signature make the densest symbols on the pile.
 * And **cropping to the symbol** lets it be rendered at its own resolution instead
 * of the frame's: a barcode filling a fifth of a 24-megapixel photo is throttled to
 * a few hundred pixels once the whole frame is capped at MAX_EDGE.
 *
 * Speed was a problem and is worth stating plainly. The crop used to be a last
 * resort tried after six full-frame passes, which was backwards — the full-frame
 * passes are the expensive ones and the crop is what recovers the hard cards.
 * Reordering them, dropping the second binarizer except where it has ever paid, and
 * taking the per-pixel function call out of the neighbourhood filters took the two
 * corpora from 83 seconds to 42 without losing a read, and the worst single card
 * from 15 seconds to 4. A clean scan is a few tens of milliseconds. The whole thing
 * also runs in a worker now, so a hard card no longer freezes the page.
 *
 * The decoder returns raw bytes, and that matters more than it looks. AAMVA payloads
 * use control characters as separators and are not valid UTF-8, so decoding through
 * UTF-8 would silently substitute bytes and shift every offset after them. Signature
 * verification depends on byte offsets being exact, so bytes map one-to-one to
 * characters (latin1) instead.
 *
 * What still does not read, and why — because "the scanner failed" and "the card is
 * damaged" deserve different answers:
 *
 *   South Dakota — the magnetic stripe is printed straight across the middle of the
 *     symbol. Whole rows are solid black across every column. No preprocessing
 *     recovers ink that was never on the card.
 *   Alberta — heavy vertical banding through the symbol, a print defect. It decodes
 *     under exactly one crop-and-resample out of roughly two hundred tried, and
 *     moving that crop ten pixels loses it again. That is a lottery ticket, not a
 *     recipe, so nothing here is tuned to win it.
 *   Ontario — ZXing locates no PDF417 at all, under any combination tried.
 *   Four South Carolina / Wisconsin / North Carolina sample images — 721x473 and
 *     similar. Their symbols measure two pixels per module. They are genuine PDF417
 *     (ZXing finds the start and stop patterns and fails on the error correction),
 *     just photographed at a size that does not contain the information.
 *   Two phone photos — soft focus. Upsampling cannot add detail that the lens did
 *     not resolve.
 *
 * Everything happens locally. The image is never uploaded.
 */
import wasmUrl from 'zxing-wasm/reader/zxing_reader.wasm?url';
import type { ReaderOptions } from 'zxing-wasm/reader';
import { ScanError } from './scanError';

export { ScanError } from './scanError';

let ready: Promise<typeof import('zxing-wasm/reader')> | null = null;

/** Loaded on demand — the WASM is about a megabyte and no other page needs it. */
function loadReader() {
  if (!ready) {
    ready = import('zxing-wasm/reader').then((mod) => {
      mod.prepareZXingModule({ overrides: { locateFile: () => wasmUrl }, fireImmediately: true });
      return mod;
    });
  }
  return ready;
}

/** Start fetching the decoder before the reader has chosen a file. */
export const warmUp = () => void loadReader();

const BASE: ReaderOptions = {
  formats: ['PDF417'],
  // Worth the extra milliseconds: this is a one-shot decode of a photo that may be
  // rotated, skewed or shot against a dark background, not a live camera loop.
  tryHarder: true,
  tryRotate: true,
  tryInvert: true,
};

/** Beyond this the canvases get large without helping the decoder. */
const MAX_EDGE = 4000;

/**
 * Grayscale in linear light, written back into all three channels.
 *
 * The usual integer luma below (`(77R + 151G + 28B) >> 8`) averages sRGB values,
 * which are gamma-encoded, so it does not measure brightness and it crushes the dark
 * end. Decoding to linear, weighting by Rec. 709 and re-encoding measures it
 * properly — but "properly" is not the same as "better here": swapped in globally it
 * reads Ohio and loses the District of Columbia. So it is applied only in the crop
 * stage, where it is the difference between reading Ohio's card and not.
 *
 * Writing the result to R, G and B means every filter downstream can stay as it is:
 * the integer luma of a grey pixel is that pixel, since 77 + 151 + 28 is exactly 256.
 */
const TO_LINEAR = (() => {
  const t = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const c = i / 255;
    t[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  return t;
})();

/**
 * Encoded exactly rather than through a lookup table. A 4096-entry table is within
 * one code value everywhere and still loses Ohio's card — a symbol whose decode
 * turns on single-level differences is a symbol at the edge of readable, and there
 * is no reason to hand it an approximation when this runs on one crop, once.
 */
function toSrgb(v: number): number {
  const c = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(1, c)) * 255);
}

function linearGray(src: ImageData): ImageData {
  const { width: w, height: h, data } = src;
  const out = new ImageData(w, h);
  for (let i = 0; i < data.length; i += 4) {
    const lin =
      0.2126 * TO_LINEAR[data[i]] +
      0.7152 * TO_LINEAR[data[i + 1]] +
      0.0722 * TO_LINEAR[data[i + 2]];
    out.data[i] = out.data[i + 1] = out.data[i + 2] = toSrgb(lin);
    out.data[i + 3] = 255;
  }
  return out;
}

/** Rec. 601 integer luma, one byte per pixel. */
function grayscale(src: ImageData): Uint8ClampedArray {
  const { width: w, height: h, data } = src;
  const gray = new Uint8ClampedArray(w * h);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    gray[p] = (data[i] * 77 + data[i + 1] * 151 + data[i + 2] * 28) >> 8;
  }
  return gray;
}

/**
 * Every local-neighbourhood filter here, over one summed-area table.
 *
 * `combine` turns a pixel and the mean of the square around it into an output value.
 * The mean is computed inline rather than behind a helper: at four thousand pixels
 * across this loop runs tens of millions of times, and a function call per pixel is
 * the difference between a scan that feels instant and one that visibly stalls.
 */
function boxFilter(
  src: ImageData,
  radius: number,
  combine: (value: number, mean: number) => number,
): ImageData {
  const { width: w, height: h } = src;
  const gray = grayscale(src);

  // One row/column of padding so lookups need no bounds checks.
  const stride = w + 1;
  const sum = new Float64Array(stride * (h + 1));
  for (let y = 0; y < h; y++) {
    let rowSum = 0;
    const g0 = y * w;
    const above = y * stride;
    const here = (y + 1) * stride;
    for (let x = 0; x < w; x++) {
      rowSum += gray[g0 + x];
      sum[here + x + 1] = sum[above + x + 1] + rowSum;
    }
  }

  const out = new ImageData(w, h);
  for (let y = 0; y < h; y++) {
    const y0 = y - radius < 0 ? 0 : y - radius;
    const y1 = y + radius > h - 1 ? h - 1 : y + radius;
    const top = y0 * stride;
    const bottom = (y1 + 1) * stride;
    const rows = y1 - y0 + 1;
    const g0 = y * w;
    for (let x = 0; x < w; x++) {
      const x0 = x - radius < 0 ? 0 : x - radius;
      const x1 = x + radius > w - 1 ? w - 1 : x + radius;
      const mean =
        (sum[bottom + x1 + 1] - sum[top + x1 + 1] - sum[bottom + x0] + sum[top + x0]) /
        (rows * (x1 - x0 + 1));
      const v = combine(gray[g0 + x], mean);
      const o = (g0 + x) * 4;
      out.data[o] = out.data[o + 1] = out.data[o + 2] = v < 0 ? 0 : v > 255 ? 255 : v;
      out.data[o + 3] = 255;
    }
  }
  return out;
}

/**
 * Threshold each pixel against the mean of its neighbourhood rather than one value
 * for the whole image, which is what makes a glossy card readable.
 */
const adaptiveThreshold = (src: ImageData, window: number, offset: number) =>
  boxFilter(src, Math.max(1, window >> 1), (v, mean) => (v > mean - offset ? 255 : 0));

/**
 * Flat-field correction: divide out the illumination instead of thresholding against
 * it. Each pixel becomes mid-grey plus its own deviation from a wide local mean,
 * amplified — so a sheen that drifts across the card is removed while the bars keep
 * their edges, and ZXing gets to do its own binarisation on an evenly lit image.
 *
 * This is the single most effective filter here. Keeping the grey rather than
 * committing to black or white leaves the decoder information it can still use, and
 * the cards it recovers are the ones that matter: New York, Virginia, North Carolina
 * and Wisconsin, the densest symbols on the pile because they carry a signature.
 *
 * The window is a fraction of image width rather than a pixel count, so it means the
 * same thing whether the input is a 1000px crop or a 4000px scan.
 */
const flatField = (src: ImageData, fraction: number, gain: number) =>
  boxFilter(
    src,
    Math.max(15, Math.min(150, Math.round((src.width * fraction) / 2))),
    (v, mean) => 128 + (v - mean) * gain,
  );

/**
 * Sharpen across the bars only. A PDF417 row is constant down a column, so blurring
 * vertically averages signal; blurring along a row is what smears one module into
 * the next. Subtracting a horizontal blur therefore undoes defocus without inventing
 * edges — which is what makes a hand-held photo readable.
 */
function unsharpRows(src: ImageData, radius: number, amount: number): ImageData {
  const { width: w, height: h } = src;
  const gray = grayscale(src);
  const out = new ImageData(w, h);
  const blurred = new Float32Array(w);
  const span = 2 * radius + 1;
  for (let y = 0; y < h; y++) {
    const g0 = y * w;
    let sum = 0;
    for (let x = -radius; x <= radius; x++) sum += gray[g0 + (x < 0 ? 0 : x > w - 1 ? w - 1 : x)];
    for (let x = 0; x < w; x++) {
      blurred[x] = sum / span;
      const add = x + radius + 1;
      const drop = x - radius;
      sum += gray[g0 + (add > w - 1 ? w - 1 : add)] - gray[g0 + (drop < 0 ? 0 : drop)];
    }
    for (let x = 0; x < w; x++) {
      const v = gray[g0 + x] + amount * (gray[g0 + x] - blurred[x]);
      const o = (g0 + x) * 4;
      out.data[o] = out.data[o + 1] = out.data[o + 2] = v < 0 ? 0 : v > 255 ? 255 : v;
      out.data[o + 3] = 255;
    }
  }
  return out;
}

/** A rectangle of the source image, rendered at a chosen width. */
interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * OffscreenCanvas where it exists, a DOM canvas otherwise. This module runs inside a
 * worker, where there is no `document` — see scanBarcode.worker.ts.
 */
function surface(w: number, h: number): OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D {
  if (typeof OffscreenCanvas !== 'undefined') {
    return new OffscreenCanvas(w, h).getContext('2d', { willReadFrequently: true })!;
  }
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas.getContext('2d', { willReadFrequently: true })!;
}

function render(bitmap: ImageBitmap, box: Box, w: number, h: number): ImageData {
  const ctx = surface(w, h);
  ctx.drawImage(bitmap, box.x, box.y, box.w, box.h, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
}

/**
 * Render `box` with the bars horizontal and level: quarter-turned if the symbol runs
 * down the frame, then tilted by `degrees` to take out the skew of a hand-held shot.
 * `long` is the width the result is rendered at, measured along the bars.
 */
function renderAligned(
  bitmap: ImageBitmap,
  box: Box,
  vertical: boolean,
  degrees: number,
  long: number,
): ImageData {
  const srcLong = vertical ? box.h : box.w;
  const srcShort = vertical ? box.w : box.h;
  const w = Math.min(MAX_EDGE, long);
  const h = Math.max(1, Math.round((w / srcLong) * srcShort));

  const rad = (degrees * Math.PI) / 180;
  // Grow the canvas to hold the tilted rectangle rather than clipping its corners.
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  const cw = Math.round(w * cos + h * sin);
  const ch = Math.round(w * sin + h * cos);

  const ctx = surface(cw, ch);
  // Anything outside the card should read as quiet zone, not as black.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, cw, ch);
  ctx.translate(cw / 2, ch / 2);
  ctx.rotate(rad);
  if (vertical) ctx.rotate(-Math.PI / 2);
  ctx.imageSmoothingQuality = 'high';
  if (vertical) {
    ctx.drawImage(bitmap, box.x, box.y, box.w, box.h, -h / 2, -w / 2, h, w);
  } else {
    ctx.drawImage(bitmap, box.x, box.y, box.w, box.h, -w / 2, -h / 2, w, h);
  }
  return ctx.getImageData(0, 0, cw, ch);
}

/**
 * Find the symbol without decoding it.
 *
 * A PDF417 is the one part of a license back that is dense in edges running *across*
 * the bars — printed guilloche, portraits and text have edges in both directions, and
 * a magnetic stripe has almost none. So: count gradient crossings per row, take the
 * tallest band well above the rest, then do the same across columns inside it. It is
 * a projection profile, the oldest trick in document analysis, and it costs one
 * downscaled pass.
 *
 * Both orientations are tried, because a card photographed in portrait has its
 * barcode running down the frame, and that is how people actually hold one. The
 * better-scoring orientation wins.
 *
 * This exists because ZXing's own locator sometimes fails on a card whose symbol is
 * perfectly visible, and because a tight crop can be rendered at its own resolution
 * rather than the frame's — a barcode filling a fifth of a 24-megapixel photo is
 * throttled to a few hundred pixels once the whole frame is capped at MAX_EDGE.
 */
function findSymbol(
  probe: ImageData,
  full: { width: number; height: number },
): (Box & { vertical: boolean }) | null {
  const { width: w, height: h } = probe;
  const gray = grayscale(probe);

  let best: (Box & { vertical: boolean; score: number }) | null = null;
  for (const vertical of [false, true]) {
    const edge = new Uint8Array(w * h);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const d = vertical
          ? Math.abs(gray[(y + 1) * w + x] - gray[(y - 1) * w + x])
          : Math.abs(gray[y * w + x + 1] - gray[y * w + x - 1]);
        edge[y * w + x] = d > 40 ? 1 : 0;
      }
    }

    // `major` runs across the bars, `minor` along them.
    const major = vertical ? w : h;
    const minor = vertical ? h : w;
    const along = new Float32Array(major);
    for (let a = 0; a < major; a++) {
      let n = 0;
      for (let b = 0; b < minor; b++) n += vertical ? edge[b * w + a] : edge[a * w + b];
      along[a] = n / minor;
    }
    const band = pickBand(along, 0.35, Math.round(major * 0.02));
    if (!band) continue;

    const across = new Float32Array(minor);
    for (let b = 0; b < minor; b++) {
      let n = 0;
      for (let a = band[0]; a < band[1]; a++) n += vertical ? edge[b * w + a] : edge[a * w + b];
      across[b] = n / (band[1] - band[0]);
    }
    const span = pickBand(across, 0.25, Math.round(minor * 0.03));
    if (!span) continue;

    const [x0, x1] = vertical ? band : span;
    const [y0, y1] = vertical ? span : band;
    let ink = 0;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) ink += edge[y * w + x];
    const area = Math.max(1, (x1 - x0) * (y1 - y0));
    // Dense *and* large: a patch of text is dense but small, a whole card is large
    // but sparse.
    const score = (ink / area) * Math.sqrt(area);
    if (!best || score > best.score) {
      const sx = full.width / w;
      const sy = full.height / h;
      best = {
        x: x0 * sx,
        y: y0 * sy,
        w: (x1 - x0) * sx,
        h: (y1 - y0) * sy,
        vertical,
        score,
      };
    }
  }
  return best;
}

/** Longest run above `share` of the peak, bridging gaps up to `gapTol` long. */
function pickBand(profile: Float32Array, share: number, gapTol: number): [number, number] | null {
  let peak = 0;
  for (const v of profile) if (v > peak) peak = v;
  const cut = peak * share;
  let best: [number, number] | null = null;
  let start = -1;
  let gap = 0;
  for (let i = 0; i <= profile.length; i++) {
    if (i < profile.length && profile[i] >= cut) {
      if (start < 0) start = i;
      gap = 0;
    } else if (start >= 0) {
      gap++;
      if (gap > gapTol || i === profile.length) {
        const end = i - gap;
        if (!best || end - start > best[1] - best[0]) best = [start, end];
        start = -1;
        gap = 0;
      }
    }
  }
  return best;
}

/**
 * The scan, in three acts.
 *
 * 1. Hand the file straight to ZXing. That reads a clean scan or a well-framed
 *    photo — 45 of the 58 cards in the test corpus — in a few tens of milliseconds,
 *    and nothing below it is worth doing if this works.
 * 2. Find the symbol and work on a crop of just it. This used to be a last resort
 *    after six full-frame passes, which was backwards: the full-frame passes are the
 *    expensive ones (a 24-megapixel photo is twenty times the pixels of the barcode
 *    inside it) and the crop is what actually recovers the hard cards. Locating it
 *    costs one 800-pixel pass.
 * 3. Only if the symbol cannot be located, fall back to the whole frame.
 *
 * Reordering acts 2 and 3 took the corpus from 83 seconds to 19 without losing a
 * single read, and the worst single card from 15 seconds to 4.
 */

/** Probe width for locating the symbol. Small enough to be free, big enough to see. */
const PROBE = 800;

/** The whole-frame fallback is capped by area, not edge: 4000x5300 is 21 megapixels. */
const FRAME_PIXELS = 9e6;

interface Attempt {
  angle: number;
  width: number;
  filters: Filter[];
}

type Filter = 'plain' | 'flat' | 'flatWide' | 'sharpen' | 'linearThreshold';

const FILTERS: Record<Filter, (image: ImageData) => ImageData> = {
  plain: (image) => image,
  flat: (image) => flatField(image, 0.025, 2),
  flatWide: (image) => flatField(image, 0.05, 2),
  sharpen: (image) => unsharpRows(image, 2, 2),
  linearThreshold: (image) => adaptiveThreshold(linearGray(image), 25, -3),
};

/**
 * What to try on the cropped symbol, in order. Three things vary and all three earn
 * their place: **size**, because rendering the crop on its own terms decouples the
 * symbol's resolution from the frame's; **tilt**, because a card held in the hand is
 * never square to the lens; and **filter**, because the failures split between too
 * soft and unevenly lit.
 *
 * Be warned that this is where the marginal cards live, and marginal means marginal:
 * several decode under one combination and not its neighbour. This is the shortest
 * list that recovers every card I have seen it recover.
 */
const CROP_PLAN: Attempt[] = [
  { angle: 0, width: 3000, filters: ['plain', 'flat', 'linearThreshold', 'sharpen'] },
  { angle: 0, width: 1600, filters: ['plain', 'flat'] },
  { angle: -2, width: 1600, filters: ['plain'] },
  { angle: 2, width: 1600, filters: ['plain'] },
];

const FRAME_FILTERS: Filter[] = ['plain', 'flat', 'flatWide'];

/**
 * Decode the license barcode in an image.
 *
 * @returns the payload as a latin1 string, one character per byte.
 */
export async function scanBarcode(file: Blob): Promise<string> {
  const { readBarcodes } = await loadReader();

  /*
   * LocalAverage wins 61 of the 64 reads in the corpus, so it goes first everywhere
   * and the second binarizer is spent only where it has ever paid: on the original
   * file, and on the flat-fielded crop. Trying both on every step doubled the ZXing
   * time of every failure for three cards.
   */
  const attempt = async (input: Blob | ImageData, thorough = false) => {
    const binarizers = thorough
      ? (['LocalAverage', 'GlobalHistogram'] as const)
      : (['LocalAverage'] as const);
    for (const binarizer of binarizers) {
      try {
        const results = await readBarcodes(input, { ...BASE, binarizer });
        const hit = results.find((r) => r.isValid && r.bytes?.length);
        if (hit) return hit.bytes;
      } catch {
        // A step that throws is just a step that failed; keep going.
      }
    }
    return null;
  };

  // Act one: the file itself. The WASM decodes the image natively and this is both
  // the fastest path and the one most cards take.
  let bytes = await attempt(file, true);

  let bitmap: ImageBitmap | null = null;
  if (!bytes) {
    try {
      bitmap = await createImageBitmap(file);
    } catch {
      throw new ScanError('That file could not be read as an image.');
    }

    const frame = { x: 0, y: 0, w: bitmap.width, h: bitmap.height };
    const probe = render(
      bitmap,
      frame,
      PROBE,
      Math.max(1, Math.round((PROBE / bitmap.width) * bitmap.height)),
    );
    const found = findSymbol(probe, bitmap);

    // Act two: the symbol on its own, squared up and sized to suit it.
    if (found) {
      // Quiet zones matter to the decoder and the detected edges sit inside them.
      // The ends of the bars get the bigger margin: that boundary has few edges of
      // the kind the detector measures, so its extent is the one that under-reports.
      const alongBars = found.vertical ? 0.04 : 0.12;
      const acrossBars = found.vertical ? 0.12 : 0.04;
      const box: Box = {
        x: Math.max(0, found.x - found.w * acrossBars),
        y: Math.max(0, found.y - found.h * alongBars),
        w: found.w * (1 + 2 * acrossBars),
        h: found.h * (1 + 2 * alongBars),
      };
      outer: for (const { angle, width, filters } of CROP_PLAN) {
        const image = renderAligned(bitmap, box, found.vertical, angle, width);
        for (const filter of filters) {
          bytes = await attempt(FILTERS[filter](image), filter === 'flat');
          if (bytes) break outer;
        }
      }
    }

    // Act three: the whole frame, for images whose symbol could not be located.
    if (!bytes) {
      // Width at which the whole frame fits the pixel budget, whatever its aspect.
      const budget = Math.floor(Math.sqrt((FRAME_PIXELS * bitmap.width) / bitmap.height));
      for (const scale of [1, 2]) {
        const w = Math.min(MAX_EDGE, budget, Math.round(bitmap.width * scale));
        const image = render(
          bitmap,
          frame,
          w,
          Math.max(1, Math.round((w / bitmap.width) * bitmap.height)),
        );
        for (const filter of FRAME_FILTERS) {
          bytes = await attempt(FILTERS[filter](image), false);
          if (bytes) break;
        }
        if (bytes) break;
      }
    }

    bitmap.close();
  }

  if (!bytes) {
    throw new ScanError(
      'No readable PDF417 barcode in that image. It is the wide, dense rectangle on ' +
        'the back of the card — fill the frame with it, hold the camera square, keep the ' +
        'whole barcode and its white margin in shot, and avoid glare across the stripe.',
    );
  }

  // One byte, one character. See the note at the top of this file.
  return Array.from(bytes, (b) => String.fromCharCode(b)).join('');
}
