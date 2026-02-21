import React from 'react';
import BlogPost from './BlogPost';
import vaDlBack from '../assets/va-dl-back.png';

const InsecureByDesign: React.FC = () => {
  return (
    <BlogPost
      title="Insecure by Design"
      date="2025-12-02"
    >
      <p>
        Fraudulent IDs have become increasingly prevalent across the United States, particularly on college campuses.
        The ease of acquisition has grown dramatically in recent years, they can now be purchased openly on the open internet and paid for using credit cards.
        This accessibility has spawned an entire verification industry, with companies like <a href="https://www.intellicheck.com" className="underline hover:no-underline">IntelliCheck</a>, <a href="https://www.idsentry.com" className="underline hover:no-underline">IDSentry</a>, and <a href="https://www.idscan.net" className="underline hover:no-underline">VeriScan</a> offering specialized detection services.
      </p>

      <p>
        The American Association of Motor Vehicle Administrators (AAMVA) is the non-profit trade association responsible for establishing driver's license standards throughout the United States.
        All U.S. states and Canadian provinces issue driver's licenses that comply with AAMVA standards, making the organization's security decisions critically important.
      </p>

      <p>
        The fundamental problem is that the AAMVA's barcode standard is insecure by design, and the AAMVA has financial incentives to keep it that way.
      </p>

      <hr />

      <p>
        In 2000, the AAMVA introduced its first DL/ID Card Design Standard, which established the format used for PDF417 barcodes on driver's licenses.
        Since then, the AAMVA has mandated the inclusion of a PDF417 barcode as part of their DL/ID CDS.
      </p>

      <p>
        Creating a fraudulent barcode for a driver's license is fairly trivial.
        The AAMVA along with many DMVs publicly document the exact data format used in these barcodes.
        When decoded, the PDF417 barcode reveals a plaintext structure: a header line containing the AAMVA format version, jurisdiction version, and file structure information,
        followed by three-letter data element identifiers paired with their corresponding values.
      </p>

      <p>
        <img src={vaDlBack} alt="Virginia driver's license back" className="w-full max-w-md mx-auto rounded-lg shadow-lg mb-4" />

        The decoded data from this Virginia license includes:
      </p>

      <div className="my-6 rounded-lg p-6 border" style={{ backgroundColor: 'var(--tui-bg)', borderColor: 'var(--tui-border)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--tui-bright)' }}>DCS</span>
            <span className="font-mono text-sm">REYES</span>
            <span className="text-xs" style={{ color: 'var(--tui-dim)' }}>Last Name</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--tui-bright)' }}>DAC</span>
            <span className="font-mono text-sm">RICHARD</span>
            <span className="text-xs" style={{ color: 'var(--tui-dim)' }}>First Name</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--tui-bright)' }}>DAD</span>
            <span className="font-mono text-sm">BENJAMIN</span>
            <span className="text-xs" style={{ color: 'var(--tui-dim)' }}>Middle Name</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--tui-bright)' }}>DBB</span>
            <span className="font-mono text-sm">01051987</span>
            <span className="text-xs" style={{ color: 'var(--tui-dim)' }}>Date of Birth</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--tui-bright)' }}>DBA</span>
            <span className="font-mono text-sm">01052031</span>
            <span className="text-xs" style={{ color: 'var(--tui-dim)' }}>Expiration</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--tui-bright)' }}>DBD</span>
            <span className="font-mono text-sm">05062023</span>
            <span className="text-xs" style={{ color: 'var(--tui-dim)' }}>Issue Date</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--tui-bright)' }}>DAG</span>
            <span className="font-mono text-sm">5235 JOHN TYLER HWY</span>
            <span className="text-xs" style={{ color: 'var(--tui-dim)' }}>Address</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--tui-bright)' }}>DAI</span>
            <span className="font-mono text-sm">WILLIAMSBURG</span>
            <span className="text-xs" style={{ color: 'var(--tui-dim)' }}>City</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--tui-bright)' }}>DAJ</span>
            <span className="font-mono text-sm">VA</span>
            <span className="text-xs" style={{ color: 'var(--tui-dim)' }}>State</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--tui-bright)' }}>DAK</span>
            <span className="font-mono text-sm">231852553</span>
            <span className="text-xs" style={{ color: 'var(--tui-dim)' }}>Zip Code (XXXXX-XXXX format)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--tui-bright)' }}>DAQ</span>
            <span className="font-mono text-sm">T16700285</span>
            <span className="text-xs" style={{ color: 'var(--tui-dim)' }}>License Number</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--tui-bright)' }}>DBC</span>
            <span className="font-mono text-sm">1</span>
            <span className="text-xs" style={{ color: 'var(--tui-dim)' }}>Sex (Male)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--tui-bright)' }}>DAU</span>
            <span className="font-mono text-sm">072 IN</span>
            <span className="text-xs" style={{ color: 'var(--tui-dim)' }}>Height</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--tui-bright)' }}>DAY</span>
            <span className="font-mono text-sm">BRO</span>
            <span className="text-xs" style={{ color: 'var(--tui-dim)' }}>Eye Color</span>
          </div>
        </div>
      </div>

      <p>
        All of this sensitive personal information is stored in an unencrypted, easily parsable format.
        With basic programming knowledge, anyone can decode these barcodes, modify the data, and generate a new barcode that will be parsed identically to a legitimate one.
      </p>

      <p>
        Here's what the raw barcode data actually looks like when decoded:
      </p>

      <pre className="my-6 rounded p-4 overflow-x-auto text-sm font-mono border border-tui-border" style={{ backgroundColor: 'var(--tui-bg)', color: 'var(--tui-text)' }}>
        {`@
ANSI 636000100202DL00410422ZV04630096DL
DCS REYES
DAC RICHARD
DAD BENJAMIN
DBB 01051987
DBA 01052031
DAG 5235 JOHN TYLER HWY
DAI WILLIAMSBURG
DAJ VA
DAQ T16700285
...`}
      </pre>

      <p>
        The format is straightforward: a header containing the AAMVA version (10) and jurisdiction version (02), followed by three-letter field codes and their values.
        Anyone with a PDF417 encoder library can generate a barcode that scanners will parse identically to a legitimate one.
      </p>

      <p>
        The clear solution to this problem is to implement digital signatures in the barcode data.
        Digital signatures would allow any scanner to verify a barcode's authenticity instantly, without database queries, without per-transaction fees, and even without internet connectivity.
      </p>

      <p>
        Digital signatures work through asymmetric cryptography: the DMV signs the barcode data using a private key that only they possess, producing a signature that can then be embedded in the barcode data as another three-letter field code.
        Anyone can then verify that signature using the DMV's public key, which can be freely distributed.
        The math ensures that producing a valid signature without the private key is computationally infeasible, so forgers cannot create a matching signature even if they can read and copy all the other data.
      </p>

      <p>
        In fact, AAMVA already mandates this exact technology for their Mobile Driver's Licenses (mDLs) standard.
        It explicitly requires that mDL data be transmitted "along with a cryptographic signature from the Issuer proving that the data have not been altered"<sup><a href="#ref1" className="underline">1</a></sup>.
      </p>

      <p>
        States such as New York and Virginia have implemented proprietary cryptographic security fields to their PDF417 barcodes.
        Their barcodes are still fully compliant with the AAMVA standard as they store the data inside jurisdiction-specific fields.
        However, these cryptographic security fields are not part of the AAMVA standard and are not publically documented.
        To the majority of people, these fields are entirely useless as there is no way to validate them.
      </p>

      <p>
        The AAMVA does sell a solution to this vulnerability: the Driver's License Data Verification (DLDV) Service<sup><a href="#ref2" className="underline">2</a></sup>.
        This service allows businesses to submit data extracted from a DL/ID barcode and verify whether it matches the corresponding state DMV database records.
        In theory, this would catch <i>any</i> fraudulent modifications to barcode data for the states that support it.
      </p>

      <p>
        However, DLDV is very much not an easy-to-use self-serve API.
        The AAMVA must approve your business/organization to use the service.
        In fact, the AAMVA is so secretative about the service that they require you to sign a <b>non-disclosure agreement</b> before providing any documentation.
      </p>

      <p>
        Even if you <i>do</i> manage to get approved, DLDV is not a cost-effective solution.
        The pricing for DLDV is not publicly disclosed, but two providers (considered "Gateway Partners" by the AAMVA) publish their own pricing.
        TokenWorks, a hardware vendor for ID scanning, charges $1.25 - $2 per scan<sup><a href="#ref3" className="underline">3</a></sup> for their DMVCheck service, depending how many scans you need.
        Dealertrack, a major dealership software platform, charges $4 per lookup with DLDV<sup><a href="#ref4" className="underline">4</a></sup>.
      </p>

      <p>
        Using DLDV simply is not a cost-effective solution for most businesses.
        TokenWorks' DMVCheck service is regarded as a "a second line of defense"<sup><a href="#ref5" className="underline">5</a></sup> simply because it is a pay-per-use service that would easily cost their customers (which are primarily bars and liquor stores) thousands of dollars per month to use for every scan.
      </p>
      <p>
        Rather than using DMVCheck for every single ID scan, TokenWorks opts to use IDSentry's Barcode Detective service.
        This service is much less accurate than using DLDV, but it allows for TokenWorks to advertise an "unlimited" amount of scans that can detect fraudulent IDs.
        IDSentry can catch approximately 30% of fraudulent IDs from one of the most common ID vendors<sup><a href="#ref6" className="underline">6</a></sup>, while DLDV can catch approximately 86% of fraudulent IDs<sup><a href="#ref7" className="underline">7</a></sup>, a very significant difference.
      </p>

      <p>
        The cost to businesses adds up quickly: a busy bar scanning 200 IDs per night at $2 per verification would pay over $140,000 annually for protection that cryptographic signatures could provide for free.
        AAMVA does not disclose DLDV-specific revenue, but estimates suggest the service generates $5-15 million annually<sup><a href="#note1" className="underline">*</a></sup>, a substantial portion of their operating budget.
      </p>

      <hr></hr>

      <p>
        If the AAMVA implemented digital signatures in barcodes, the core data would still remain plaintext allowing for any scanner to read it.
        However, the signature would contain cryptographic proof that the data originated from a legitimate DMV and hasn't been modified.
        Forgers can copy the visible information, but they cannot forge the signature without the DMV's private key.
      </p>


      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--tui-bg-hl)' }}>
              <th style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600 }}></th>
              <th style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600 }}>
                Current Physical License
                <span className="block text-xs font-normal mt-1" style={{ color: 'var(--tui-dim)' }}>AAMVA PDF417</span>
              </th>
              <th style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600 }}>
                Mobile Driver's License
                <span className="block text-xs font-normal mt-1" style={{ color: 'var(--tui-dim)' }}>ISO 18013-5 mDL</span>
              </th>
              <th style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600 }}>
                Proposed Signed Barcode
                <span className="block text-xs font-normal mt-1" style={{ color: 'var(--tui-dim)' }}>PDF417 + Signature</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem', fontWeight: 500, backgroundColor: 'var(--tui-bg)', color: 'var(--tui-bright)' }}>Data Format</td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>Plaintext (AAMVA fields)</td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>CBOR binary</td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>Plaintext (AAMVA fields)</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem', fontWeight: 500, backgroundColor: 'var(--tui-bg)', color: 'var(--tui-bright)' }}>Data Readable By</td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>Any PDF417 scanner</td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>mDL-compatible apps</td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>Any PDF417 scanner</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem', fontWeight: 500, backgroundColor: 'var(--tui-bg)', color: 'var(--tui-bright)' }}>Cryptographic Signing</td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>
                <span className="inline-flex items-center" style={{ color: 'var(--tui-red)' }}>
                  <span className="mr-1">✗</span> Optional, proprietary
                </span>
              </td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>
                <span className="inline-flex items-center" style={{ color: 'var(--tui-green)' }}>
                  <span className="mr-1">✓</span> Required (COSE/ECDSA)
                </span>
              </td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>
                <span className="inline-flex items-center" style={{ color: 'var(--tui-green)' }}>
                  <span className="mr-1">✓</span> Required
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem', fontWeight: 500, backgroundColor: 'var(--tui-bg)', color: 'var(--tui-bright)' }}>Offline Verification</td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>
                <span className="inline-flex items-center" style={{ color: 'var(--tui-red)' }}>
                  <span className="mr-1">✗</span> No
                </span>
              </td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>
                <span className="inline-flex items-center" style={{ color: 'var(--tui-green)' }}>
                  <span className="mr-1">✓</span> Yes
                </span>
              </td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>
                <span className="inline-flex items-center" style={{ color: 'var(--tui-green)' }}>
                  <span className="mr-1">✓</span> Yes
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem', fontWeight: 500, backgroundColor: 'var(--tui-bg)', color: 'var(--tui-bright)' }}>Forgery Detection</td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>
                <span className="inline-flex items-center" style={{ color: 'var(--tui-red)' }}>
                  <span className="mr-1">✗</span> Requires DLDV ($2+/scan)
                </span>
              </td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>
                <span className="inline-flex items-center" style={{ color: 'var(--tui-green)' }}>
                  <span className="mr-1">✓</span> Built-in, free
                </span>
              </td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>
                <span className="inline-flex items-center" style={{ color: 'var(--tui-green)' }}>
                  <span className="mr-1">✓</span> Built-in, free
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem', fontWeight: 500, backgroundColor: 'var(--tui-bg)', color: 'var(--tui-bright)' }}>PKI Infrastructure</td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>None</td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>AAMVA DTS / VICAL</td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>AAMVA DTS / VICAL</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem', fontWeight: 500, backgroundColor: 'var(--tui-bg)', color: 'var(--tui-bright)' }}>Backward Compatible</td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>N/A</td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>
                <span className="inline-flex items-center" style={{ color: 'var(--tui-red)' }}>
                  <span className="mr-1">✗</span> No
                </span>
              </td>
              <td style={{ border: '1px solid var(--tui-border)', padding: '0.75rem 1rem' }}>
                <span className="inline-flex items-center" style={{ color: 'var(--tui-green)' }}>
                  <span className="mr-1">✓</span> Yes
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mb-4 leading-relaxed">
        The ISO/IEC 18013-5 standard, which AAMVA mandates for mDLs, requires cryptographic signing of all credential data. Each state DMV
        that issues mDLs must establish an Issuing Authority Certificate Authority (IACA) and generate signing keys. AAMVA's Digital Trust
        Service (DTS) already aggregates these public keys into a centralized Verified Issuer Certificate Authority List (VICAL), allowing
        any verifier to download the keys needed to authenticate mDLs from any participating state. The infrastructure already exists and the distribution mechanism is already operational.
      </p>

      <p className="mb-4 leading-relaxed">
        Applying the same signatures to PDF417 barcodes would require minimal additional effort: states could use their existing mDL signing keys
        (or generate new ones for physical IDs under the same IACA) and the AAMVA extends the VICAL to include those physical credential keys.
        The Card Design Standard should be updated to enforce the requirement of a specific implementation of digital signatures.
      </p>


      <p className="mb-4 leading-relaxed">
        The AAMVA barcode format would need to be updated to include a new data element for the signature.
        Legacy scanners that don't recognize the new field would simply ignore it, continuing to read name, DOB, and other fields exactly as they do today.
      </p>

      <pre className="my-6 rounded p-4 overflow-x-auto text-sm font-mono border border-tui-border" style={{ backgroundColor: 'var(--tui-bg)', color: 'var(--tui-text)' }}>
        <code style={{ color: 'var(--tui-dim)' }}>...</code>{'\n'}
        DAQ T16700285{'\n'}
        <code className="px-1 rounded" style={{ backgroundColor: 'rgba(158, 206, 106, 0.15)', color: 'var(--tui-green)' }}>ZZS MEUCIQDrX2v8mK9pLq...7fHsA3dKwIgY2==</code>  <code style={{ color: 'var(--tui-dim)' }}>← signature</code>{'\n'}
        DBC 1{'\n'}
        <code style={{ color: 'var(--tui-dim)' }}>...</code>
      </pre>

      <p className="mb-4 leading-relaxed">
        There are no technical barriers to enabling secure barcodes as the PKI infrastructure is already being built anyway for mDL.
        What's missing is the mandate, and the willingness to forgo an estimated $5-15 million in annual DLDV revenue.
      </p>

      <p>
        The entire verification industry's existence proves the market demand for secure ID validation.
        But it shouldn't require a $2-per-scan service to verify what cryptographic signatures could prove instantly and at no marginal cost.
      </p>

      <p>
        I don't expect mDLs to fully replace physical IDs any time soon.
        Rollouts over the past few years has been incredibly slow, and I expect most Americans to continue carrying physical licenses for years, if not decades.
        Companies like IntelliCheck and IDSentry provide genuine value in the current landscape.
        But their entire market exists because of a policy choice, not a technical limitation.
      </p>

      <p>
        The AAMVA's issue is that if they mandaded signed/secure barcodes, like they already do for mDLs, their entire DLDV business model would evaporate.
        Scanners would be able to verify authenticity mathematically, allowing for no per-scan fees and offline validation.
      </p>

      <p>
        The question isn't whether AAMVA <i>can</i> mandate secure barcodes.
        It's whether they <i>will</i>, and what it would take to make security more profitable than vulnerability.
      </p>

      <div className="mt-8 pt-4" style={{ borderTop: '1px solid var(--tui-border)' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--tui-bright)' }}>Notes</h2>
        <div className="text-sm" style={{ color: 'var(--tui-dim)' }}>
          <p id="note1" className="mb-4">
            <sup className="font-semibold">*</sup> <span className="font-semibold">Revenue Estimate:</span>{' '}
            AAMVA does not disclose DLDV-specific revenue. Their Form 990 filings show $42M in program services revenue (FY2023), but bundle all verification systems together.<sup><a href="#ref8" className="underline">8</a></sup>{' '}
            The NMVTIS Annual Report shows that system generated $9.6M,<sup><a href="#ref9" className="underline">9</a></sup>{' '}
            leaving ~$32M for DLDV, CDLIS, S2S, and smaller programs.
            DLDV is the only one that operates as a commercial fee-per-query service without federal funding.
            There is still a level of uncertainty about DLDV's share of that revenue.
          </p>
        </div>
      </div>

      <div className="mt-8 pt-4" style={{ borderTop: '1px solid var(--tui-border)' }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--tui-bright)' }}>References</h2>
        <ol className="space-y-3 text-sm" style={{ color: 'var(--tui-dim)' }}>
          {/* 
            Uses APA citation style (7th edition)
            Format: Author. (Date). Title in italics. Publisher Name. URL
            Example: AAMVA. (n.d.). Driver's License Data Verification (DLDV). American Association of Motor Vehicle Administrators. https://www.aamva.org/...
          */}

          <li id="ref1" className="leading-relaxed">
            AAMVA. (2024). <i>Mobile Driver's License (mDL) Frequently Asked Questions for Law Enforcement</i>. American Association of Motor Vehicle Administrators.{' '}
            <a
              href="https://www.aamva.org/getmedia/6c37bda5-e43d-493e-8294-bba0d18aa2f9/mDL-FAQ-for-LE-01242024.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all"
            >
              https://www.aamva.org/getmedia/6c37bda5-e43d-493e-8294-bba0d18aa2f9/mDL-FAQ-for-LE-01242024.pdf
            </a>
          </li>

          <li id="ref2" className="leading-relaxed">
            AAMVA. (n.d.). <i>Driver's License Data Verification (DLDV)</i>. American Association of Motor Vehicle Administrators.{' '}
            <a
              href="https://www.aamva.org/technology/systems/verification-systems/dldv"
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all"
            >
              https://www.aamva.org/technology/systems/verification-systems/dldv
            </a>
          </li>

          <li id="ref3" className="leading-relaxed">
            TokenWorks. (n.d.). <i>Transactions</i>. [Login required].{' '}
            <a
              href="https://account.tokenworks.net/Transactions/Transactions"
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all"
            >
              https://account.tokenworks.net/Transactions/Transactions
            </a>
          </li>

          <li id="ref4" className="leading-relaxed">
            Dealertrack. (2025, January). <i>Virginia Registration & Title Driver License Data Verification (DLDV) FAQs</i>.{' '}
            <a
              href="https://us.dealertrack.com/wp-content/uploads/sites/2/2025/01/Virginia-DLDV-FAQs.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all"
            >
              https://us.dealertrack.com/wp-content/uploads/sites/2/2025/01/Virginia-DLDV-FAQs.pdf
            </a>
          </li>

          <li id="ref5" className="leading-relaxed">
            TokenWorks. (2025, February 20). <i>Introducing DMVCheck: Enhanced ID verification technology for IdentiFake systems</i>.{' '}
            <a
              href="https://www.idscanner.com/drivers-license-news/introducing-dmvcheck-enhanced-id-verification-technology-for-identifake-systems/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all"
            >
              https://www.idscanner.com/drivers-license-news/introducing-dmvcheck-enhanced-id-verification-technology-for-identifake-systems/
            </a>
          </li>

          <li id="ref6" className="leading-relaxed">
            IDScanning. (n.d.). <i>UN Scanning Database</i>.{' '}
            <a
              href="https://idscanning.pages.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all"
            >
              https://idscanning.pages.dev/
            </a>
          </li>

          <li id="ref7" className="leading-relaxed">
            AAMVA. (n.d.). <i>IT Systems Participation Map</i>. American Association of Motor Vehicle Administrators.{' '}
            <a
              href="https://www.aamva.org/it-systems-participation-map?id=594"
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all"
            >
              https://www.aamva.org/it-systems-participation-map?id=594
            </a>
          </li>

          <li id="ref8" className="leading-relaxed">
            ProPublica. (n.d.). <i>American Association of Motor Vehicle Administrators - Nonprofit Explorer</i>.{' '}
            <a
              href="https://projects.propublica.org/nonprofits/organizations/530172317"
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all"
            >
              https://projects.propublica.org/nonprofits/organizations/530172317
            </a>
          </li>

          <li id="ref9" className="leading-relaxed">
            AAMVA. (2023). <i>NMVTIS FY2023 Annual Report</i>. American Association of Motor Vehicle Administrators.{' '}
            <a
              href="https://www.aamva.org/getmedia/71c7a1a1-7692-48e1-9138-b71c702f2988/NMVTIS-FY2023-Annual-Report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all"
            >
              https://www.aamva.org/getmedia/71c7a1a1-7692-48e1-9138-b71c702f2988/NMVTIS-FY2023-Annual-Report.pdf
            </a>
          </li>
        </ol>
      </div>
    </BlogPost>
  );
};

export default InsecureByDesign;
