/**
 * Talking to the scan worker.
 *
 * Falls back to running on this thread where a module worker or OffscreenCanvas is
 * missing, so the checker still works rather than failing closed.
 */
import { ScanError } from './scanError';
import type { ScanRequest, ScanResponse } from './scanBarcode.worker';

let worker: Worker | null = null;
let next = 1;
const pending = new Map<number, { resolve: (s: string) => void; reject: (e: Error) => void }>();

function supported() {
  return typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined';
}

function ensure(): Worker | null {
  if (!supported()) return null;
  if (!worker) {
    worker = new Worker(new URL('./scanBarcode.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e: MessageEvent<ScanResponse>) => {
      const waiting = pending.get(e.data.id);
      if (!waiting) return;
      pending.delete(e.data.id);
      if (e.data.ok) waiting.resolve(e.data.payload);
      else waiting.reject(e.data.scan ? new ScanError(e.data.message) : new Error(e.data.message));
    };
  }
  return worker;
}

/** Start the worker and let it fetch the decoder before a file is chosen. */
export function warmUp() {
  const w = ensure();
  if (w) w.postMessage({ id: 0, warm: true } satisfies ScanRequest);
  else void import('./scanBarcode').then((m) => m.warmUp());
}

export async function scan(file: Blob): Promise<string> {
  const w = ensure();
  if (!w) {
    const { scanBarcode } = await import('./scanBarcode');
    return scanBarcode(file);
  }
  const id = next++;
  return new Promise<string>((resolve, reject) => {
    pending.set(id, { resolve, reject });
    w.postMessage({ id, file } satisfies ScanRequest);
  });
}

export { ScanError };
