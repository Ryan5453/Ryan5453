/**
 * The Digital Bazaar credential stack ships as plain ES modules with JSDoc rather
 * than TypeScript declarations, and there are no @types packages for any of them.
 *
 * These stubs exist only so the compiler will accept the imports. They deliberately
 * describe just the handful of exports verifyCalifornia.ts actually uses, rather than
 * pretending to type the whole libraries — a wrong declaration is worse than an
 * absent one, because it reads as a guarantee. Everything crossing this boundary is
 * treated as unknown shape and narrowed at the point of use.
 */

declare module '@digitalbazaar/pdf417-dl-canonicalizer' {
  export const aamva: {
    decode(options: { data: string | Uint8Array; encoding?: string }): any;
    select(options: { object: any; selector: any }): Promise<Map<string, unknown>>;
    hash(options: { document: unknown }): Promise<Uint8Array>;
    canonicalize(options: { document: unknown }): Uint8Array;
  };
}

declare module '@digitalbazaar/cborld' {
  export function decode(options: {
    cborldBytes: Uint8Array;
    documentLoader: (url: string) => Promise<unknown>;
    typeTableLoader?: () => Map<string, Map<string, number>>;
  }): Promise<any>;
}

declare module '@digitalbazaar/data-integrity' {
  export class DataIntegrityProof {
    constructor(options: { cryptosuite: unknown; signer?: unknown; date?: Date });
  }
}

declare module '@digitalbazaar/ecdsa-xi-2023-cryptosuite' {
  export function createCryptosuite(options: { extraInformation: Uint8Array }): unknown;
}

declare module '@digitalbazaar/did-method-web' {
  export class DidWebDriver {
    constructor(options?: unknown);
  }
}

declare module '@digitalbazaar/did-io' {
  export class CachedResolver {
    constructor(options?: unknown);
    use(driver: unknown): void;
  }
}

declare module 'jsonld-document-loader' {
  export class JsonLdDocumentLoader {
    addStatic(url: string, document: unknown): void;
    setDidResolver(resolver: unknown): void;
    build(): (url: string) => Promise<unknown>;
  }
}

declare module '@digitalbazaar/credentials-context' {
  export const contexts: Map<string, unknown>;
}

declare module '@digitalbazaar/vc-barcodes-context' {
  export const contexts: Map<string, unknown>;
}

declare module '@digitalbazaar/vc' {
  export function verifyCredential(options: {
    credential: unknown;
    suite: unknown;
    documentLoader: (url: string) => Promise<unknown>;
    checkStatus?: (options: any) => Promise<{ verified: boolean; error?: Error }>;
  }): Promise<any>;
}
