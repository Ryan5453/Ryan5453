import type { MapCategory, SignatureMark } from '../components/JurisdictionMap';
import {
    CbnLogo,
    EntrustLogo,
    IdemiaLogo,
    ThalesLogo,
    VeridosLogo,
} from '../components/vendorLogos';

/**
 * Who prints each jurisdiction's card, and which of those cards carry a signature.
 *
 * This lives outside the post because two pages need it now — the post itself and
 * the standalone vendor map — and because the sourcing notes below are the most
 * valuable part of the file. They record not just what each answer is but how good
 * the evidence for it is, which matters when several entries rest on vendor
 * marketing rather than a procurement record.
 */
type Vendor =
    | 'IDEMIA'
    | 'Thales'
    | 'Canadian Bank Note'
    | 'Veridos'
    | 'Entrust'
    | 'Unknown';

/**
 * Who prints each jurisdiction's cards, keyed by the two-letter code the map
 * addresses them with. Jurisdiction names are not repeated here — they live in
 * northAmerica.ts, alongside the outline each one is drawn from.
 *
 * 'Unknown' is a finding, not a gap in this file: it marks a jurisdiction where no
 * primary record names a producer — four territories, plus Manitoba, which has an
 * open RFI out for card manufacturing.
 *
 * Alberta is the one entry here not resting on a document. Its contract is sealed
 * by design — CBC reports the cost is "part of the contractor's confidential bidding
 * process" — so there is no award notice to cite. It is recorded as Canadian Bank
 * Note on identification of the card itself, which is consistent with CBN already
 * producing for the Northwest Territories and Nunavut, and with Alberta's card being
 * laser-engraved polycarbonate, CBN's speciality. Weaker sourcing than every other
 * row; flagged rather than hidden.
 *
 * ── Corroboration ────────────────────────────────────────────────────────────
 * Thales enumerated its own North American customers in its "100M driver's license
 * and ID cards" release of 29 Aug 2023 (figures as of 31 May 2023): Alaska, Arizona,
 * Colorado, District of Columbia, Georgia, Hawaii, Idaho, Maryland, New Brunswick,
 * New Hampshire, New York, Newfoundland & Labrador, Nova Scotia, Prince Edward
 * Island, Quebec, Texas and Wyoming.
 *
 * Fifteen of those seventeen match this table exactly, which is the strongest
 * independent check the dataset has — and it upgrades Idaho, Arizona, Colorado,
 * Georgia, Hawaii, Maryland, Wyoming and DC, all of which otherwise rested on vendor
 * marketing alone. Oklahoma is in this table but not on that list, correctly: Service
 * Oklahoma awarded Thales in 2024, after the list closed.
 *
 * The two that do not match, and why:
 *
 *   TEXAS — on the 2023 list, IDEMIA here. Both are true at their own dates. IDEMIA
 *   began issuing Texas licenses on 18 Aug 2025, per its own release and a Texas DPS
 *   announcement, so Texas moved Thales -> IDEMIA that month. Worth knowing that
 *   IDEMIA took the second-largest state off a competitor in 2025 and still shipped
 *   no barcode signature.
 *
 *   NEW YORK — on the 2023 list, CBN here, and CBN is right for the card: contract
 *   C000751 runs to 29 Nov 2026, the award survived a bid protest and an Article 78
 *   proceeding, and CBN's signing key was recovered from actual New York cards. The
 *   same release notes Thales also sells "enrollment services, biometric
 *   verification, documents customization", and New Hampshire's RFP shows Thales
 *   supplying image-capture workstations under a contract separate from card
 *   production — so the list most likely counts any DL/ID programme involvement, not
 *   just the card. Unexplained rather than resolved.
 *
 * Manitoba is absent from that list, which is the one useful thing it says about it:
 * not a Thales customer as of May 2023.
 *
 * A second, sharper check: IDEMIA publishes a one-pager per US jurisdiction at
 * na.idemia.com (.../2025/05/<Name>-4.2025.pdf, dated April 2025). Each is split
 * into "How We Serve You Today" and "Other Ways IDEMIA *Can* Serve You" — so it
 * states, per jurisdiction, whether IDEMIA makes that card or merely wants to. Read
 * them with the column layout preserved; flattened text merges the two and inverts
 * the answer. All 50 published sheets were checked (there is none for DC).
 *
 * Fifteen jurisdictions we assign to a competitor sit in IDEMIA's *Can* column —
 * AK, AZ, CO, GA, HI, MD, WY, NC, NY, VA, WI, OH, OR, VT, WA — which is fifteen
 * independent confirmations that IDEMIA does not print those cards. Four apparent
 * conflicts resolved on reading the exact wording:
 *
 *   FLORIDA   "Over-the-Counter Driver License Production (with Central Issuance
 *             Renewal Services)" — confirms both IDEMIA and the counter issuance,
 *             and shows Florida is actually a hybrid: counter for new, central for
 *             renewals.
 *   N. HAMPS. "Produce Physical Driver License and State ID (Coming Soon)" — which
 *             turned out to mean imminent, not hypothetical. See below.
 *   MONTANA   IDEMIA claimed it in April 2025; Montana awarded Veridos in 2025 and
 *             its polycarbonate cards launched that December. IDEMIA was the
 *             incumbent it displaced.
 *   TEXAS     Sheet is silent because it predates IDEMIA taking Texas in Aug 2025.
 *
 * Two caveats worth carrying into the prose:
 *
 *   SOUTH CAROLINA is CBN only since Fall 2025. IDEMIA's April 2025 sheet has it
 *   doing "Over-the-Counter Driver License Production" plus central-issuance
 *   renewals. So SC cards issued before that conversion are IDEMIA counter-printed
 *   and will not carry a CBN signature — the five-state signature claim holds only
 *   for cards issued after the switch.
 *
 *   NEW HAMPSHIRE was recorded as Thales and is now IDEMIA. The Thales reading came
 *   from RFP DOS 2023-004 — but that document describes the arrangement it existed to
 *   replace, which makes it evidence of the outgoing vendor, not the incoming one.
 *   IDEMIA won it: $4,933,920 through 31 Dec 2028, at $4.10 per card falling to $3.06
 *   for FY2026-28. NH launched a new design on 23 Jan 2025 with, per its own
 *   coverage, "upgraded security features and materials" — and a substrate change is
 *   not something done mid-contract, because the substrate is tied to the production
 *   line. The "(Coming Soon)" on IDEMIA's April 2025 sheet fits a January design
 *   launch on the outgoing line with IDEMIA's fulfilment system arriving later in
 *   2025, which is also when the FY2026 price tier starts. No source names the
 *   producer of the new card outright; this is the chain of inference, recorded so it
 *   can be overturned.
 *
 *   IDAHO is genuinely contested. Thales lists it (Aug 2023); IDEMIA's April 2025
 *   sheet says "Produce Physical Driver License and State ID" under Today. Both are
 *   vendor marketing, no procurement record either way, and IDEMIA's is the more
 *   recent. Recorded as Thales, but it is the least certain entry in this table
 *   after Alberta.
 */
export const cardProducer: Record<string, Vendor> = {
    // 50 states, DC, and the five territories
    AL: 'IDEMIA', AK: 'Thales', AZ: 'Thales',
    AR: 'IDEMIA', CA: 'IDEMIA', CO: 'Thales',
    CT: 'IDEMIA', DE: 'IDEMIA', DC: 'Thales',
    FL: 'IDEMIA', GA: 'Thales', HI: 'Thales',
    ID: 'Thales', IL: 'IDEMIA', IN: 'IDEMIA',
    IA: 'IDEMIA', KS: 'IDEMIA', KY: 'IDEMIA',
    LA: 'IDEMIA', ME: 'IDEMIA', MD: 'Thales',
    MA: 'IDEMIA', MI: 'IDEMIA', MN: 'IDEMIA',
    MS: 'IDEMIA', MO: 'IDEMIA', MT: 'Veridos',
    NE: 'IDEMIA', NV: 'IDEMIA', NH: 'IDEMIA',
    NJ: 'IDEMIA', NM: 'IDEMIA', NY: 'Canadian Bank Note',
    NC: 'Canadian Bank Note', ND: 'IDEMIA', OH: 'Veridos',
    OK: 'Thales', OR: 'Veridos', PA: 'IDEMIA',
    RI: 'IDEMIA', SC: 'Canadian Bank Note', SD: 'IDEMIA',
    TN: 'IDEMIA', TX: 'IDEMIA', UT: 'IDEMIA',
    VT: 'Veridos', VA: 'Canadian Bank Note', WA: 'Veridos',
    WV: 'IDEMIA', WI: 'Canadian Bank Note', WY: 'Thales',
    PR: 'Unknown', VI: 'Unknown', GU: 'Veridos',
    MP: 'Unknown', AS: 'Unknown',
    // Canadian provinces and territories
    AB: 'Canadian Bank Note', BC: 'Veridos', MB: 'Unknown',
    NB: 'Thales', NL: 'Thales', NS: 'Thales',
    NT: 'Canadian Bank Note', NU: 'Canadian Bank Note', ON: 'Veridos',
    PE: 'Thales', QC: 'Thales', SK: 'Veridos',
    YT: 'Entrust',
};

/**
 * Each of the four majors wears a colour taken from its own logo, stepped for this
 * page's black background. The remaining two buckets are greys: the map's palette
 * is full at four hues (see JurisdictionMap), and a fifth would have collapsed
 * under colour-blindness. Greys separate by lightness instead, which is safe by
 * construction. `ink` is whichever of white or near-black clears 4.5:1 on the fill.
 *
 * Logo heights are set individually so the four marks share a cap height rather
 * than a box height — the cbn monogram is square where the others are wordmarks.
 */
export const vendors: MapCategory[] = [
    {
        keys: ['IDEMIA'],
        label: 'IDEMIA',
        color: '#643ec6',
        ink: '#ffffff',
        legend: <IdemiaLogo height={22} title="IDEMIA" />,
    },
    {
        keys: ['Thales'],
        label: 'Thales',
        color: '#07a4bd',
        ink: '#111111',
        legend: <ThalesLogo height={12} title="Thales" />,
    },
    {
        keys: ['Canadian Bank Note'],
        label: 'Canadian Bank Note',
        color: '#b30a39',
        ink: '#ffffff',
        legend: <CbnLogo height={24} title="Canadian Bank Note" />,
    },
    {
        // Includes two jurisdictions filed elsewhere by name: Vermont, whose 2018
        // contract went to Valid USA (Veridos bought Valid's US identity business in
        // June 2022), and Ontario, often still credited to G+D — Veridos is the G+D
        // and Bundesdruckerei joint venture that absorbed that business in 2015.
        keys: ['Veridos'],
        label: 'Veridos',
        color: '#c38401',
        ink: '#111111',
        legend: <VeridosLogo height={14} title="Veridos" />,
    },
    {
        // Yukon alone, and a different kind of relationship from the rest: Entrust
        // supplies the printers and card stock, and territorial staff produce the
        // cards over the counter in Whitehorse. The magenta is snapped from the
        // gradient in Entrust's own mark, so like the other four it is the vendor's
        // colour rather than an assigned one.
        //
        // White ink on this fill measures 4.46:1, a hair under the 4.5:1 text
        // threshold. Holding that line exactly would have meant a desaturated mauve
        // that reads as no brand at all. The shortfall costs one two-letter label
        // (Yukon, ~17px), whose name is also in the legend and the hover readout.
        keys: ['Entrust'],
        label: 'Entrust',
        color: '#d62d9b',
        ink: '#ffffff',
        legend: <EntrustLogo height={20} title="Entrust" />,
    },
    {
        keys: ['Unknown'],
        label: 'Unknown',
        // Nudged up from #666666 so the word itself can carry the colour: this is the
        // one legend mark that is text rather than a logo, and text needs 4.5:1.
        // #757575 is 4.56:1 on black and still takes white ink at 4.61:1 on the map.
        color: '#757575',
        ink: '#ffffff',
        legendIsText: true,
        legend: 'Unknown',
    },
];

/**
 * Signature status. This used to be a second visual encoding — a star on each signed
 * jurisdiction — but six stars competing with 69 labels made the map harder to read
 * for a fact that only matters once you are asking about a specific place. It now
 * surfaces in the popup instead.
 */
export const signatures: SignatureMark[] = [
    { codes: ['CA'], label: 'signed, key published' },
    { codes: ['NY', 'NC', 'SC', 'VA', 'WI'], label: 'signed, no key published' },
];

/**
 * A code listing in the site's panel chrome, with a title notch saying what you are
 * looking at. The label matters more than the frame: these blocks show a decode, a
 * recipe and a pair of keys, and without a heading a reader has to infer which is
 * which from context.
 *
 * Prose belongs in <p>, not in here. Everything inside is meant to be read as data
 * or as steps — aligned in columns rather than wired together with ASCII arrows,
 * which never line up once the text around them changes.
 */
