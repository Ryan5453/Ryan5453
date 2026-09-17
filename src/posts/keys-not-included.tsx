import React from 'react';
import { Link } from 'react-router-dom';
import BlogPost, { PostMeta } from '../components/BlogPost';

export const meta: PostMeta = {
    slug: 'keys-not-included',
    title: 'Keys Not Included',
    date: '2026-09-16',
    description: 'Several states sign their driver\'s license barcodes but publish no keys to check them, so I reconstructed them with ECDSA key recovery.',
    links: [
        { to: '/blog/keys-not-included/vendors', label: 'who prints your ID', key: 'w' },
        { to: '/blog/keys-not-included/verify', label: 'scan an ID', key: 's' },
        { to: '/blog/keys-not-included/recover', label: 'recover a missing key', key: 'r' },
    ],
};

const Listing: React.FC<{ title: string; children: string }> = ({ title, children }) => (
    <div className="tui-panel my-8">
        <span className="tui-panel-title font-mono">{title}</span>
        <pre
            className="overflow-x-auto mono-read text-xs sm:text-sm"
            /*
             * .prose-reading pre already paints a background, border and padding.
             * Inside the panel that would draw a second frame around the first, so
             * the listing keeps only the type and lets the panel own the chrome.
             */
            style={{
                color: 'var(--tui-text)',
                lineHeight: 1.65,
                margin: 0,
                padding: 0,
                border: 'none',
                background: 'transparent',
            }}
        >
            {children}
        </pre>
    </div>
);

const KeysNotIncluded: React.FC = () => {
    return (
        <BlogPost meta={meta}>

            <p>
                In <Link to="/blog/insecure-by-design" className="underline">Insecure by Design</Link> I argued that the AAMVA should require states to cryptographically sign the PDF417 barcode on a driver's license and mentioned that two states, New York and Virginia, already sign theirs with something proprietary.
                A Mobile Driver's License (mDL) or a passport follows a public standard, so anyone can check one but a New York or Virginia license can only be checked by the DMV that issued it.
            </p>

            <p>
                Virginia published a calibration sheet that lays out the AAMVA format of the barcode including the state's own subfiles. It names a "ninety-character security object" and stops there.
                But then California did exactly what I asked: <a href="https://www.dmv.ca.gov/portal/file/verifying-digital-signatures-on-california-dlid-documents-pdf/" className="underline hover:no-underline">Verifying Digital Signatures on California DL/ID Documents</a> explains exactly how to use the DMV's public key to check whether a California ID is real.
            </p>

            <hr>

            </hr>

            <p>
                On the back of any U.S. state ID or DL is a standard AAMVA PDF417 barcode.
                Most of it is exactly the documented, plaintext data element structure I described in <Link to="/blog/insecure-by-design" className="underline">Insecure by Design</Link>: three-letter codes and their values, DCS/DAC/DAD for the name, DBB/DBA/DBD for the dates of birth, expiry, and issue, DAQ for the license number, DCF for the document discriminator, and so on.
                The header carries an Issuer Identification Number that says which jurisdiction printed the card: 636000 is Virginia, 636001 is New York, 636004 is North Carolina, and 636014 is California.
            </p>

            <p>
                The interesting part is the jurisdiction-specific subfiles, a section prefixed with <code>Z</code> plus a state letter (<code>ZV</code> in Virginia, <code>ZN</code> in New York, <code>ZC</code> in California).
                AAMVA reserves these subfiles for whatever a state wants to add, and they stay fully standards-compliant because a generic scanner reading the mandatory subfile simply skips over them.
            </p>

            <p>
                On October 1st, 2025, the California DMV announced its new license and ID design in a press release.
                Most of it is the usual catalogue of physical security features, and then there is this<sup><a href="#ref-canews" className="underline">1</a></sup>:
            </p>

            <blockquote className="my-6 pl-4 italic" style={{ borderLeft: '3px solid var(--tui-border)', color: 'var(--tui-text)' }}>
                "The DMV will add a digital security signature to one of the two barcodes on the back of the cards.
                California will be one of the first states to add this kind of digital signature."
            </blockquote>

            <p>
                California does not produce their IDs in house - they contract it out to a third-party vendor called IDEMIA, who produces ~61% of IDs/DLs in the U.S. (by jurisdiction, not physical quantity).
                IDEMIA was likely the one who integrated this digital signature system for CA, and they did an incredible job, though the design credit goes to the W3C spec they used, written largely at Digital Bazaar.
            </p>

            <p>
                Inside California's <code>ZC</code> subfile is a complete <a href="https://w3c.github.io/vc-barcodes/" target="_blank" rel="noopener noreferrer" className="underline">W3C Verifiable Credential Barcode</a>, a credential compressed with CBOR-LD and signed with the <code>ecdsa-xi-2023</code> cryptosuite<sup><a href="#ref-cadmv" className="underline">2</a></sup>.
                What gets signed is spelled out: a bitstring selects which AAMVA fields are covered, they are formatted as code-plus-value, joined with newlines, sorted, and hashed.
                The credential points at <code>did:web:credentials.dmv.ca.gov</code>, which resolves to a plain JSON document at a well-known URL on the DMV's own domain<sup><a href="#ref-cadid" className="underline">3</a></sup>.
                The URL leads to the barcode-signing public key, labeled <code>#vm-vcb-1</code>, a normal P-256 public key sitting there for anyone to download.
                California even ships an open-source verifier with real valid and revoked test barcodes, so anyone can trivially run the verification process themselves.
            </p>

            <p>
                After California announced they included a signature in their barcodes it wasn't until the following April that they released the documentation on what signs what, which fields are covered, what a verifier should reconstruct, or where the key lives.
                For roughly six months, California was in precisely the position that New York and Virginia are in now: a real cryptographic signature, on a real card, in circulation, publicly announced, and no way for anyone outside the DMV to check it.
                Or so I thought.
            </p>

            <hr>
            </hr>

            <p>
                Canadian Bank Note (CBN) is a (unsurprisingly) Canadian company that manufactures DL/IDs for five U.S. states: New York, Virginia, North Carolina, South Carolina, and Wisconsin.
                I discovered that CBN actually implements digital signatures for all five states, not just NY and VA.
                I don't have South Carolina or Wisconsin barcodes myself - people who do decoded theirs and confirmed the field is there.
                But again, this signature is largely useless since there (was) no way to actually verify it.
            </p>


            <p>
                Inside CBN's security feature is a string that is <a href="https://en.wikipedia.org/wiki/Ascii85" target="_blank" rel="noopener noreferrer" className="underline">Ascii85</a> encoded.
                Strip that encoding away and you are left with a short binary blob, and that blob is a <a href="https://en.wikipedia.org/wiki/X.690#DER_encoding" target="_blank" rel="noopener noreferrer" className="underline">DER</a> structure: a <code>SEQUENCE</code> containing two <code>INTEGER</code>s, each 256 bits wide.
                A SEQUENCE of two 256-bit integers named <i>r</i> and <i>s</i> is the canonical on-the-wire encoding of an ECDSA signature over the P-256 curve (also called secp256r1).
            </p>

            <p>
                These blobs come out to 70, 71, or 72 bytes depending on the card, which is exactly what ECDSA produces, because <i>r</i> and <i>s</i> are effectively random integers and DER drops or adds a leading byte depending on whether the high bit of each happens to be set.
                A fixed-length hash or a counter would not vary like that, but a pair of random 256-bit integers does.
                Across three real New York cards, one North Carolina card, and six Virginia samples, every single one fit this structure.
            </p>


            <p>
                ECDSA has a specific cryptographic property that given a signature and the message it signed, you can mathematically recover the public key that produced it<sup><a href="#ref-sec1" className="underline">4</a></sup>.
                Each signature yields a small set of candidate keys rather than one, but if you have several signatures from the same signer, the real key is the single candidate they all share.
            </p>

            <p>
                However, to recover this key, you need the exact signed message, which is entirely undocumented.
                I tried bruteforcing hundreds of thousands of possible orderings and formats but eventually figured out (with Claude's help) that unlike California's implementation, all of it gets signed. The signature field itself is part of the signed message.
                Before signing, the encoder fills the field with a placeholder (<code>0</code>), repeated for the field's exact length - signs the entire payload including that placeholder, and then writes the real signature over the top of it.
                To verify, you put the placeholder back.
            </p>

            <p>
                On a New York card the payload is 484 bytes and the <code>ZNB</code> value sits at bytes 393 to 483. To check it:
            </p>

            <ol>
                <li>Take the payload exactly as decoded, byte for byte.</li>
                <li>Overwrite the signature value in place with <code>0</code> repeated to the same length: <code>payload[:393] + b"0" * 90 + payload[483:]</code>.</li>
                <li>SHA-256 the result.</li>
                <li>Verify the DER signature against that digest with ECDSA P-256.</li>
            </ol>

            <hr>
            </hr>

            <p>
                Three real New York cards produce one key that all three pairs agree on. Six Virginia samples produce one key that all fifteen pairs agree on.
            </p>

            <p>
                I only have one North Carolina sample, and it takes two to pin down a key.
                If you have two from a state I don't cover (NC, SC, WI), you can <Link to="/blog/keys-not-included/recover" className="underline">recover its key yourself here</Link>.
            </p>

            <Listing title="recovered public keys">
{`New York   IIN 636001   field ZNB
  02851d63a281796be0ca11189f03028abf80e032838f83215889b9e708eac16482

Virginia   IIN 636000   field ZVA
  02d0f2823d63c854566c5da2cb07e114dbad16f874c2422f74806fe3e2f4775f1d`}
            </Listing>

            <p>
                Both are P-256 public keys in compressed form, and every card I have access to verifies against them.
                Change even a single byte of a surname and it is instantly able to be detected as inauthentic.
                These are public keys, which are meant to be published - recovering one lets anyone check a signature, not forge one.
            </p>

            <p>
                I built a little demo to check the signatures across California, New York, and Virginia: take a picture of the barcode and check it <Link to="/blog/keys-not-included/verify" className="underline">here</Link>.
                It decodes the PDF417 barcode, parses the AAMVA format for any jurisdiction, and verifies the signature for the three that have one.
                Everything runs in your browser so I will never see any image or extracted data from your ID.
                The keys are per-jurisdiction and the construction is shared across the vendor's states. Virginia's signatures fail under New York's key and vice versa, which is the right design, because it means one state's compromise doesn't take the others with it.
                A valid signature only proves the state issued that data. The photo is not signed (not included in the barcode at all), so a genuine barcode copied onto a counterfeit still passes.
            </p>

            <p>
                I ran my finished verifier against a counterfeit New York sample: to a blind eye its barcode is a pretty good clone of a real New York card. Same 484-byte payload length, same subfile directory, same field widths and padding, same card-revision date.
                More importantly, the <code>ZNB</code> field is not empty and not garbage: it contains a well-formed 71-byte DER ECDSA signature, correctly Ascii85-encoded, with the right prefix and a plausible length.
                But it fails the cryptographic check instantly, because it was signed with a throwaway key, not the state's.
            </p>
            <p>
                States do not design their own barcodes. They run procurements, and a very small number of companies build what gets printed.
                You can view what vendor produces IDs for what state <Link to="/blog/keys-not-included/vendors" className="underline">here</Link>.
                Canadian Bank Note produces the cards for five: New York, North Carolina, South Carolina, Virginia and Wisconsin.
                IDEMIA produces them for thirty-one of the fifty-one US jurisdictions.
            </p>

            <p>
                California's cards are made by IDEMIA, under a twelve-year contract awarded in 2022, and IDEMIA began issuing all of California's licenses and IDs in October 2025<sup><a href="#ref-idemia-ca" className="underline">5</a></sup>.
                The Verifiable Credential Barcode is part of the card design IDEMIA built with the California DMV. So the open, documented, publicly-verifiable implementation is not some California-specific civic virtue. It is a product one vendor has already built, shipped, and operates at the scale of the largest state in the country.
            </p>

            <p>
                The issue is that they never shipped this anywhere else. Of the thirty-one jurisdictions IDEMIA produces cards for, <b>exactly one</b> has any public evidence of a verifiable signed barcode.
                Whatever this feature is, it is not spreading, and the constraint plainly isn't engineering, because the engineering is finished and running in the largest of those thirty-one.
            </p>

            <p>
                In August 2025 IDEMIA launched a redesigned driver's license for Texas, and their announcement lists the security features: tamper-resistant polycarbonate, laser engraving, tactile surfaces, a Texas-shaped optical variable window, a laser-engraved star for REAL ID compliance<sup><a href="#ref-idemia-tx" className="underline">6</a></sup>.
                Every one of those is a physical anti-counterfeiting measure, verified by a human squinting at a card. There is no mention of a digital signature.
            </p>


            <hr></hr>

            <p>
                <b>IDEMIA has already solved this and should ship it everywhere.</b> The engineering is done, the standard is published, the trust infrastructure is running in production for California. Every subsequent card program that launches without it is a choice, and it is a strange one, because the feature is finished and paid for. A verifiable barcode should be the default line item in every contract they sign, not a premium a state has to know to ask for.
            </p>

            <p>
                <b>Canadian Bank Note should document what they already built.</b> This is the cheaper ask by an enormous margin, because CBN does not need to build anything at all.
                All that is missing is a page on a website: here is the signed-message construction, and here is each state's public key. That is a weekend of documentation standing between a security feature that protects nobody and one that protects everyone who scans a card.
            </p>

            <p>
                Which loops back to where <Link to="/blog/insecure-by-design" className="underline">Insecure by Design</Link> ended. I asked whether the barcode would ever get a real signature. The answer, in these states, was yes, and it did not matter, because a signature is a public act or it is nothing.
                California, through the same vendor that serves much of the country, quietly demonstrated the whole thing done correctly, on the same math, on the document most Americans actually carry, and published the keys to prove it.
                The technology was never the obstacle. It was finished, sitting in a product catalog. The willingness to be verified was the obstacle, and it still is.
            </p>



            <hr></hr>


            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--tui-bright)' }}>References</h2>
                <ol className="space-y-3 text-sm" style={{ color: 'var(--tui-dim)' }}>
                    <li id="ref-canews" className="leading-relaxed">
                        California DMV. (2025, October 1). <i>DMV to Release New California Driver's License and Identification Card Design with Advanced Security Features</i>.{' '}
                        <a href="https://www.dmv.ca.gov/portal/news-and-media/dmv-to-release-new-california-drivers-license-and-identification-card-design-with-advanced-security-features/" target="_blank" rel="noopener noreferrer" className="underline break-all">
                            https://www.dmv.ca.gov/portal/news-and-media/dmv-to-release-new-california-drivers-license-and-identification-card-design-with-advanced-security-features/
                        </a>
                    </li>
                    <li id="ref-cadmv" className="leading-relaxed">
                        California DMV. (2026, April). <i>Verifying Digital Signatures on California DL/ID Documents: Technical Overview</i>. (PDF metadata: created 7 April 2026, modified 9 April 2026.){' '}
                        <a href="https://www.dmv.ca.gov/portal/file/verifying-digital-signatures-on-california-dlid-documents-pdf/" target="_blank" rel="noopener noreferrer" className="underline break-all">
                            https://www.dmv.ca.gov/portal/file/verifying-digital-signatures-on-california-dlid-documents-pdf/
                        </a>
                    </li>
                    <li id="ref-cadid" className="leading-relaxed">
                        California DMV. (n.d.). <i>DID document for credentials.dmv.ca.gov</i>.{' '}
                        <a href="https://credentials.dmv.ca.gov/.well-known/did.json" target="_blank" rel="noopener noreferrer" className="underline break-all">
                            https://credentials.dmv.ca.gov/.well-known/did.json
                        </a>
                    </li>
                    <li id="ref-sec1" className="leading-relaxed">
                        Certicom Research. (2009). <i>SEC 1: Elliptic Curve Cryptography</i> (Version 2.0), §4.1.6, Public Key Recovery Operation.{' '}
                        <a href="https://www.secg.org/sec1-v2.pdf" target="_blank" rel="noopener noreferrer" className="underline break-all">
                            https://www.secg.org/sec1-v2.pdf
                        </a>
                    </li>
                    <li id="ref-idemia-ca" className="leading-relaxed">
                        IDEMIA. (2025, October 10). <i>IDEMIA Public Security to Launch New State Driver's Licenses and IDs with Innovative Design for California in Partnership with the California Department of Motor Vehicles</i>.{' '}
                        <a href="https://www.idemia.com/press-release/idemia-public-security-launch-new-state-drivers-licenses-and-ids-innovative-design-california-partnership-california-department-motor-vehicles-2025-10-10" target="_blank" rel="noopener noreferrer" className="underline break-all">
                            https://www.idemia.com/press-release/idemia-public-security-launch-new-state-drivers-licenses-and-ids-innovative-design-california-partnership-california-department-motor-vehicles-2025-10-10
                        </a>
                    </li>
                    <li id="ref-idemia-tx" className="leading-relaxed">
                        IDEMIA. (2025, August 28). <i>IDEMIA Public Security to Launch New State Driver's Licenses and IDs with Enhanced Security Features for Texas in Partnership with the Texas Department of Public Safety</i>.{' '}
                        <a href="https://www.idemia.com/press-release/idemia-public-security-launch-new-state-drivers-licenses-and-ids-enhanced-security-features-texas-partnership-texas-department-public-safety-2025-08-28" target="_blank" rel="noopener noreferrer" className="underline break-all">
                            https://www.idemia.com/press-release/idemia-public-security-launch-new-state-drivers-licenses-and-ids-enhanced-security-features-texas-partnership-texas-department-public-safety-2025-08-28
                        </a>
                    </li>
                </ol>
            </div>


        </BlogPost>
    );
};

export default KeysNotIncluded;
