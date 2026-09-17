/**
 * The scan, on a worker thread.
 *
 * Decoding a hard card costs a second or two of tight pixel loops. On the main
 * thread that is a frozen page: no spinner animation, no scroll, no cancel — which
 * reads as a much longer wait than it is. Here the page stays live and can say what
 * it is doing.
 */
import { scanBarcode, warmUp } from './scanBarcode';
import { ScanError } from './scanError';

export type ScanRequest = { id: number; file: Blob } | { id: 0; warm: true };
export type ScanResponse =
  | { id: number; ok: true; payload: string }
  | { id: number; ok: false; message: string; scan: boolean };

self.onmessage = async (e: MessageEvent<ScanRequest>) => {
  if ('warm' in e.data) {
    warmUp();
    return;
  }
  const { id, file } = e.data;
  try {
    const payload = await scanBarcode(file);
    self.postMessage({ id, ok: true, payload } satisfies ScanResponse);
  } catch (err) {
    self.postMessage({
      id,
      ok: false,
      message: (err as Error).message,
      // Tells the page whether this was "could not read it" or a real fault.
      scan: err instanceof ScanError,
    } satisfies ScanResponse);
  }
};
