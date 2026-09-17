/**
 * Its own module so that the page can recognise a failed scan without pulling the
 * scanner — and its megabyte of WASM — into the main bundle. The worker and the
 * fallback path both throw this.
 */
export class ScanError extends Error {}
