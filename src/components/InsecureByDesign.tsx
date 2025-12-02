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
        Fake IDs have become increasingly prevalent across the United States, particularly on college campuses.
        The ease of acquisition has grown dramatically in recent years; fraudulent IDs can now be purchased openly on the open internet and paid for using credit cards.
        This accessibility has spawned an entire verification industry, with companies like <a href="https://www.intellicheck.com" className="text-blue-700 dark:text-blue-300 hover:text-blue-950 dark:hover:text-blue-100 transition-colors">IntelliCheck</a>, <a href="https://www.idsentry.com" className="text-blue-700 dark:text-blue-300 hover:text-blue-950 dark:hover:text-blue-100 transition-colors">IDSentry</a>, and <a href="https://www.idscan.net" className="text-blue-700 dark:text-blue-300 hover:text-blue-950 dark:hover:text-blue-100 transition-colors">VeriScan</a> offering specialized detection services.
      </p>

      <p>
        The American Association of Motor Vehicle Administrators (AAMVA) is the non-profit trade association responsible for establishing driver's license standards throughout the United States.
        All fifty U.S. states and Canadian provinces issue driver's licenses that comply with AAMVA standards, making the organization's security decisions critically important.
      </p>

      <p>
        The fundamental problem is that the AAMVA's barcode standards are insecure by design, and the AAMVA has no incentives to fix this.
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
        According to AAMVA's 2023 financial statements<sup><a href="#ref7" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>7</a></sup>, the organization generated approximately $10-15 million annually from DLDV and other verification services, which represents roughly <b>20-30%</b> of their total operating revenue.
        The vulnerability that makes fake IDs trivially easy to create also happens to be the AAMVA's second-largest revenue stream.
      </p>

      <p>
        The clear solution to this problem is to implement digital signatures in the barcode data.
        Digital signatures would allow any scanner to verify a barcode's authenticity instantly, without database queries, without per-transaction fees, and even without internet connectivity.
      </p>

      <p>
        In fact, AAMVA already mandates this exact technology for their Mobile Driver's Licenses (mDLs) standard.
        It explicitly requires that mDL data be transmitted "along with a cryptographic signature from the Issuer proving that the data have not been altered"<sup><a href="#ref8" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>8</a></sup>.
      </p>

      <p>
        States such as New York and Virginia have implemented proprietary cryptographic security fields to their PDF417 barcodes.
        Their barcodes are still fully compliant with the AAMVA standard as they store the data inside jurisdiction-specific fields.
        However, these cryptographic security fields are not part of the AAMVA standard and are not publically documented.
        To the majority of people, these fields are entirely useless as there is no way to validate them.
      </p>

      <p>
        The AAMVA does sell a solution to this vulnerability: the Driver's License Data Verification (DLDV) Service<sup><a href="#ref1" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>1</a></sup>.
        This service allows businesses to submit data extracted from a DL/ID barcode and verify whether it matches the corresponding state DMV database records.
        In theory, this would catch <i>any</i> fraudulent modifications to barcode data.
      </p>

      <p>
        However, DLDV is very much not an easy-to-use self-serve API.
        The AAMVA must approve your business/organization to use the service.
        In fact, the AAMVA is so secretative about the service that they require you to sign a <b>non-disclosure agreement</b> before providing any documentation.
      </p>

      <p>
        Even if you <i>do</i> manage to get approved, DLDV is not a cost-effective solution.
        The pricing for DLDV is not publicly disclosed, but two providers (considered "Gateway Partners" by the AAMVA) publish their own pricing.
        TokenWorks, a hardware vendor for ID scanning, charges $1.25 - $2 per scan<sup><a href="#ref2" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>2</a></sup> for their DMVCheck service, depending how many scans you need.
        Dealertrack, a major dealership software platform, charges $4 per lookup with DLDV<sup><a href="#ref3" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>3</a></sup>.
      </p>

      <p>
        Using DLDV simply is not a cost-effective solution for most businesses.
        TokenWorks' DMVCheck service is regarded as a "a second line of defense"<sup><a href="#ref4" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>4</a></sup> simply because it is a pay-per-use service that would easily cost their customers (which are primarily bars and liquor stores) thousands of dollars per month to use for every scan.
      </p>
      <p>
        Rather than using DMVCheck for every single ID scan, TokenWorks opts to use IDSentry's Barcode Detective service.
        This service is much less accurate than using DLDV, but it allows for TokenWorks to advertise an "unlimited" amount of scans that can detect fraudulent IDs.
        IDSentry can catch approximately 30% of fraudulent IDs from one of the most common ID vendors<sup><a href="#ref5" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>5</a></sup>, while DLDV can catch approximately 86% of fraudulent IDs<sup><a href="#ref6" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200" style={{ textDecoration: 'none' }}>6</a></sup>, a very significant difference.
      </p>

      <p>
        The entire verification industry's existence proves the market demand for secure ID validation.
        But it shouldn't require a $2-per-scan service to verify what cryptographic signatures could prove instantly and at no marginal cost.
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
        <h2 className="text-2xl font-bold text-blue-950 dark:text-blue-50 mb-4">References</h2>
        <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          {/* 
            Uses APA citation style (7th edition)
            Format: Author. (Date). Title in italics. Publisher Name. URL
            Example: AAMVA. (n.d.). Driver's License Data Verification (DLDV). American Association of Motor Vehicle Administrators. https://www.aamva.org/...
          */}

          <li id="ref1" className="leading-relaxed">
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

          <li id="ref2" className="leading-relaxed">
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

          <li id="ref3" className="leading-relaxed">
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

          <li id="ref4" className="leading-relaxed">
            IDScanner. (2025, February 20). <i>Introducing DMVCheck: Enhanced ID verification technology for IdentiFake systems</i>.{' '}
            <a
              href="https://www.idscanner.com/drivers-license-news/introducing-dmvcheck-enhanced-id-verification-technology-for-identifake-systems/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline break-all"
            >
              https://www.idscanner.com/drivers-license-news/introducing-dmvcheck-enhanced-id-verification-technology-for-identifake-systems/
            </a>
          </li>

          <li id="ref5" className="leading-relaxed">
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

          <li id="ref6" className="leading-relaxed">
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

          <li id="ref7" className="leading-relaxed">
            AAMVA. (2024). <i>Consolidated Financial Statements, Supplementary Information, and Reports Required in Accordance with the Uniform Guidance: Years Ended September 30, 2023 and 2022</i>. American Association of Motor Vehicle Administrators.{' '}
            <a
              href="https://www.aamva.org/about/association-information/financial-information/aamva-financial-documents"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline break-all"
            >
              https://www.aamva.org/about/association-information/financial-information/aamva-financial-documents
            </a>
          </li>

          <li id="ref8" className="leading-relaxed">
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

          <li id="ref9" className="leading-relaxed">
            New York State. (n.d.). <i>15 NYCRR § 32.10 - Encrypted two-dimensional (2D) bar code security feature</i>. Cornell Law School Legal Information Institute.{' '}
            <a
              href="https://www.law.cornell.edu/regulations/new-york/15-NYCRR-32.10"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline break-all"
            >
              https://www.law.cornell.edu/regulations/new-york/15-NYCRR-32.10
            </a>
          </li>

          <li id="ref10" className="leading-relaxed">
            Fake ID Solutions. (2025). <i>PDF417 Drivers License Barcode Generator</i>.{' '}
            <a
              href="https://barcodes.fakeidsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline break-all"
            >
              https://barcodes.fakeidsolutions.com/
            </a>
          </li>
        </ol>
      </div>
    </BlogPost>
  );
};

export default InsecureByDesign;
