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
        This accessibility has spawned an entire verification industry, with companies like <a href="https://www.intellicheck.com" className="text-blue-700 dark:text-blue-300 hover:text-blue-950 dark:hover:text-blue-100 transition-colors">IntelliCheck</a>, <a href="https://www.idsentry.com" className="text-blue-700 dark:text-blue-300 hover:text-blue-950 dark:hover:text-blue-100 transition-colors">IDSentry</a>, and <a href="https://www.idscan.net" className="text-blue-700 dark:text-blue-300 hover:text-blue-950 dark:hover:text-blue-100 transition-colors">VeriScan</a> offering specialized detection services.
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

      <div className="my-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">DCS</span>
            <span className="font-mono text-sm">REYES</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Last Name</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">DAC</span>
            <span className="font-mono text-sm">RICHARD</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">First Name</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">DAD</span>
            <span className="font-mono text-sm">BENJAMIN</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Middle Name</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">DBB</span>
            <span className="font-mono text-sm">01051987</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">DBA</span>
            <span className="font-mono text-sm">01052031</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Expiration</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">DBD</span>
            <span className="font-mono text-sm">05062023</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Issue Date</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">DAG</span>
            <span className="font-mono text-sm">5235 JOHN TYLER HWY</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Address</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">DAI</span>
            <span className="font-mono text-sm">WILLIAMSBURG</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">City</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">DAJ</span>
            <span className="font-mono text-sm">VA</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">State</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">DAK</span>
            <span className="font-mono text-sm">231852553</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Zip Code (XXXXX-XXXX format)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">DAQ</span>
            <span className="font-mono text-sm">T16700285</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">License Number</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">DBC</span>
            <span className="font-mono text-sm">1</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Sex (Male)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">DAU</span>
            <span className="font-mono text-sm">072 IN</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Height</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">DAY</span>
            <span className="font-mono text-sm">BRO</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Eye Color</span>
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

      <pre className="my-6 bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm font-mono">
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
        It explicitly requires that mDL data be transmitted "along with a cryptographic signature from the Issuer proving that the data have not been altered"<sup><a href="#ref1" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>1</a></sup>.
      </p>

      <p>
        States such as New York and Virginia have implemented proprietary cryptographic security fields to their PDF417 barcodes.
        Their barcodes are still fully compliant with the AAMVA standard as they store the data inside jurisdiction-specific fields.
        However, these cryptographic security fields are not part of the AAMVA standard and are not publically documented.
        To the majority of people, these fields are entirely useless as there is no way to validate them.
      </p>

      <p>
        The AAMVA does sell a solution to this vulnerability: the Driver's License Data Verification (DLDV) Service<sup><a href="#ref2" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>2</a></sup>.
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
        TokenWorks, a hardware vendor for ID scanning, charges $1.25 - $2 per scan<sup><a href="#ref3" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>3</a></sup> for their DMVCheck service, depending how many scans you need.
        Dealertrack, a major dealership software platform, charges $4 per lookup with DLDV<sup><a href="#ref4" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>4</a></sup>.
      </p>

      <p>
        Using DLDV simply is not a cost-effective solution for most businesses.
        TokenWorks' DMVCheck service is regarded as a "a second line of defense"<sup><a href="#ref5" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>5</a></sup> simply because it is a pay-per-use service that would easily cost their customers (which are primarily bars and liquor stores) thousands of dollars per month to use for every scan.
      </p>
      <p>
        Rather than using DMVCheck for every single ID scan, TokenWorks opts to use IDSentry's Barcode Detective service.
        This service is much less accurate than using DLDV, but it allows for TokenWorks to advertise an "unlimited" amount of scans that can detect fraudulent IDs.
        IDSentry can catch approximately 30% of fraudulent IDs from one of the most common ID vendors<sup><a href="#ref6" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>6</a></sup>, while DLDV can catch approximately 86% of fraudulent IDs<sup><a href="#ref7" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>7</a></sup>, a very significant difference.
      </p>

      <p>
        The cost to businesses adds up quickly: a busy bar scanning 200 IDs per night at $2 per verification would pay over $140,000 annually for protection that cryptographic signatures could provide for free.
        AAMVA does not disclose DLDV-specific revenue, but estimates suggest the service generates $5-13 million annually<sup><a href="#note1" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>*</a></sup>, a substantial portion of their operating budget.
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
            <tr className="bg-blue-50 dark:bg-blue-900/30">
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left font-semibold text-blue-900 dark:text-blue-100"></th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left font-semibold text-blue-900 dark:text-blue-100">
                Current Physical License
                <span className="block text-xs font-normal text-gray-600 dark:text-gray-400 mt-1">AAMVA PDF417</span>
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left font-semibold text-blue-900 dark:text-blue-100">
                Mobile Driver's License
                <span className="block text-xs font-normal text-gray-600 dark:text-gray-400 mt-1">ISO 18013-5 mDL</span>
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left font-semibold text-blue-900 dark:text-blue-100">
                Proposed Signed Barcode
                <span className="block text-xs font-normal text-gray-600 dark:text-gray-400 mt-1">PDF417 + Signature</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 font-medium bg-gray-50 dark:bg-gray-800/50">Data Format</td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">Plaintext (AAMVA fields)</td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">CBOR binary</td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">Plaintext (AAMVA fields)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 font-medium bg-gray-50 dark:bg-gray-800/50">Data Readable By</td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">Any PDF417 scanner</td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">mDL-compatible apps</td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">Any PDF417 scanner</td>
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 font-medium bg-gray-50 dark:bg-gray-800/50">Cryptographic Signing</td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                <span className="inline-flex items-center text-red-600 dark:text-red-400">
                  <span className="mr-1">✗</span> Optional, proprietary
                </span>
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                <span className="inline-flex items-center text-green-600 dark:text-green-400">
                  <span className="mr-1">✓</span> Required (COSE/ECDSA)
                </span>
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                <span className="inline-flex items-center text-green-600 dark:text-green-400">
                  <span className="mr-1">✓</span> Required
                </span>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 font-medium bg-gray-50 dark:bg-gray-800/50">Offline Verification</td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                <span className="inline-flex items-center text-red-600 dark:text-red-400">
                  <span className="mr-1">✗</span> No
                </span>
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                <span className="inline-flex items-center text-green-600 dark:text-green-400">
                  <span className="mr-1">✓</span> Yes
                </span>
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                <span className="inline-flex items-center text-green-600 dark:text-green-400">
                  <span className="mr-1">✓</span> Yes
                </span>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 font-medium bg-gray-50 dark:bg-gray-800/50">Forgery Detection</td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                <span className="inline-flex items-center text-red-600 dark:text-red-400">
                  <span className="mr-1">✗</span> Requires DLDV ($2+/scan)
                </span>
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                <span className="inline-flex items-center text-green-600 dark:text-green-400">
                  <span className="mr-1">✓</span> Built-in, free
                </span>
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                <span className="inline-flex items-center text-green-600 dark:text-green-400">
                  <span className="mr-1">✓</span> Built-in, free
                </span>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 font-medium bg-gray-50 dark:bg-gray-800/50">PKI Infrastructure</td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">None</td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">AAMVA DTS / VICAL</td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">AAMVA DTS / VICAL</td>
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 font-medium bg-gray-50 dark:bg-gray-800/50">Backward Compatible</td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">N/A</td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                <span className="inline-flex items-center text-red-600 dark:text-red-400">
                  <span className="mr-1">✗</span> No
                </span>
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                <span className="inline-flex items-center text-green-600 dark:text-green-400">
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

      <div className="my-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="relative">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center uppercase tracking-wider">Current</div>
            <div className="relative">
              <svg viewBox="0 0 120 40" className="w-48 h-16">
                <rect x="0" y="0" width="120" height="40" fill="#f3f4f6" rx="2" />
                {[2, 1, 2, 1, 1, 2, 1, 2, 2, 1, 1, 2, 1, 2, 1, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2].map((w, i) => (
                  <rect key={i} x={4 + i * 3.2} y="4" width={w} height="32" fill="#374151" />
                ))}
              </svg>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">Forgeable</span>
            </div>
          </div>

          <div className="text-gray-300 dark:text-gray-600">
            <svg className="w-6 h-6 md:rotate-0 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>

          <div className="relative">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center uppercase tracking-wider">Proposed</div>
            <div className="relative">
              <svg viewBox="0 0 120 40" className="w-48 h-16">
                <rect x="0" y="0" width="120" height="40" fill="#f3f4f6" rx="2" />
                {[2, 1, 2, 1, 1, 2, 1, 2, 2, 1, 1, 2, 1, 2, 1, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1].map((w, i) => (
                  <rect key={i} x={4 + i * 3.2} y="4" width={w} height="32" fill="#374151" />
                ))}
                <rect x="94" y="2" width="24" height="36" fill="#dcfce7" rx="1" />
                {[1, 2, 1, 2, 1, 2].map((w, i) => (
                  <rect key={`s${i}`} x={96 + i * 3.2} y="4" width={w} height="32" fill="#16a34a" />
                ))}
              </svg>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Verified</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-5 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-gray-600 rounded-sm"></div>
            <span>Data</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-sm"></div>
            <span>Signature</span>
          </div>
        </div>
      </div>

      <p className="mb-4 leading-relaxed">
        There are no technical barriers to enabling secure barcodes as the PKI infrastructure is already being built anyway for mDL.
        What's missing is the mandate, and the willingness to forgo an estimated $5-13 million in annual DLDV revenue.
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

      <div className="mt-2 pt-2 border-t-2 border-blue-200 dark:border-blue-800">
        <h2 className="text-2xl font-bold text-blue-950 dark:text-blue-50 mb-4">Notes</h2>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p id="note1" className="mb-4">
            <sup className="font-semibold">*</sup> <span className="font-semibold">Revenue Estimate:</span>{' '}
            AAMVA does not disclose DLDV-specific revenue. Their Form 990 filings show $42M in program services revenue (FY2023), but bundle all verification systems together.<sup><a href="#ref8" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>8</a></sup>{' '}
            The NMVTIS Annual Report shows that system generated $9.6M,<sup><a href="#ref9" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>9</a></sup>{' '}
            leaving ~$32M for DLDV, CDLIS, S2S, and smaller programs.
            DLDV is the only one that operates as a commercial fee-per-query service without federal funding.
            There is still a level of uncertainty about DLDV's share of that revenue.
          </p>
        </div>
      </div>

      <div className="mt-8 pt-2 border-t-2 border-blue-200 dark:border-blue-800">
        <h2 className="text-2xl font-bold text-blue-950 dark:text-blue-50 mb-4">References</h2>
        <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
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
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline break-all"
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
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline break-all"
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
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline break-all"
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
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline break-all"
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
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline break-all"
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
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline break-all"
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
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline break-all"
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
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline break-all"
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
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline break-all"
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
