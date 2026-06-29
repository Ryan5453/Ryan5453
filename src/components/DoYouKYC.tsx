import React from 'react';
import { Link } from 'react-router-dom';
import BlogPost from './BlogPost';

const DoYouKYC: React.FC = () => {
    return (
        <BlogPost
            title="Do you Know Your Citizen?"
            date="2026-06-28"
            credits="with help from Claude 4.8 Opus and Claude 3 Opus"
        >

            <p>
                Around two weeks ago (June 12th), the U.S. government issued a directive for Anthropic to suspend access to both Claude 5 Fable and Claude 5 Mythos for all foreign nationals.
                Anthropic responded by suspending access to Fable and Mythos for all customers, including non-foreign nationals.
                Then, on June 26th OpenAI announced their GPT-5.6 series of models, albeit in a limited preview form due to a request from the U.S. government.
                Later that day similar news followed for Anthropic, who received notice that their most capable model, Claude 5 Mythos, could be "redeployed to a small group of cyber defenders and infrastructure providers."
            </p>


            <h2 className="text-tui-yellow mt-8 mb-2">Why now?</h2>

            <p>
                Two days before Anthropic's export ban, Dario Amodei, CEO of Anthropic, published his short essay "Policy on the AI Exponential".
                Amodei argued that the risks posed by advanced AI systems are no longer hypothetical, but real and present.
                He proposed a narrow, FAA-style regulatory approach with mandatory third-party testing to mitigate these risks.
                The U.S. government's intervention followed swiftly on the heels of Amodei's call to action.
            </p>

            <p>
                However, the government's quick response lacked the transparency Amodei called for.
                The public has little visibility into the decision-making process or criteria behind these restrictions.
                Without clear insight into whether they were grounded in rigorous technical standards or political considerations, it's difficult to have confidence in the government's approach.
            </p>

            <h2 className="text-tui-yellow mt-8 mb-2">The real concern</h2>

            <p>
                The government's true worry was a reported jailbreak technique that could circumvent Fable's (Mythos' "safer" sibling) safeguards to unlock offensive cybersecurity abilities.
                Unfortunately, it is virtually impossible to completely eliminate jailbreaks.
                Anthropic claims that no AI system currently on the market has perfectly robust defenses, and its most advanced safeguards are framed as driving the attack rate as low as possible rather than to zero<sup><a href="#ref-classifiers" className="underline">1</a></sup>.
            </p>
            <p>
                Mythos' unlocked capabilities could be considered a cyber weapon in the wrong hands, but a malicious U.S. citizen could do just as much damage as a foreign adversary.
                However, the government chose to regulate LLMs using export law, whose language is limited to restrictions based on foreign status.
                Export law is designed to prevent technology from reaching foreign nationals, so the only regulation it can impose is "no foreign nationals may access this."
            </p>

            <p>
                It is virtually impossible for Anthropic to properly distinguish foreign nationals from U.S. persons at their scale.
                The only way to guarantee no foreign national slips through is to block everyone, which is exactly what Anthropic did.
            </p>


            <h2 className="text-tui-yellow mt-8 mb-2">Passport holders</h2>

            <div className="float-right ml-8 mb-4 text-tui-yellow" aria-hidden="true">
                <svg
                    viewBox="0 0 220 300"
                    width="200"
                    height="273"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                >
                    <rect x="6" y="6" width="208" height="288" rx="3" strokeWidth="1.5" />
                    <rect x="14" y="14" width="192" height="272" rx="2" strokeWidth="0.5" />

                    <text x="110" y="54" textAnchor="middle" fill="currentColor" stroke="none" fontSize="11" letterSpacing="2" fontFamily="inherit">UNITED STATES</text>
                    <text x="110" y="70" textAnchor="middle" fill="currentColor" stroke="none" fontSize="11" letterSpacing="2" fontFamily="inherit">OF AMERICA</text>

                    <circle cx="110" cy="148" r="42" strokeWidth="1" />
                    <circle cx="110" cy="148" r="36" strokeWidth="0.5" />
                    <polygon
                        points="110,124 115.3,140.4 132.6,140.4 118.6,150.5 124,166.9 110,156.8 96,166.9 101.4,150.5 87.4,140.4 104.7,140.4"
                        strokeWidth="0.8"
                    />

                    <text x="110" y="222" textAnchor="middle" fill="currentColor" stroke="none" fontSize="16" letterSpacing="5" fontFamily="inherit">PASSPORT</text>

                    <rect x="92" y="246" width="36" height="26" rx="1" strokeWidth="0.8" />
                    <rect x="100" y="252" width="20" height="14" strokeWidth="0.5" />
                    <line x1="92" y1="253" x2="100" y2="253" strokeWidth="0.5" />
                    <line x1="92" y1="259" x2="100" y2="259" strokeWidth="0.5" />
                    <line x1="92" y1="265" x2="100" y2="265" strokeWidth="0.5" />
                    <line x1="120" y1="253" x2="128" y2="253" strokeWidth="0.5" />
                    <line x1="120" y1="259" x2="128" y2="259" strokeWidth="0.5" />
                    <line x1="120" y1="265" x2="128" y2="265" strokeWidth="0.5" />
                </svg>
            </div>


            <p>
                Export law uses the term "U.S. person," which is a broader term than just a "U.S. citizen."
                A U.S. person is a citizen, lawful permanent resident (green card holder), or protected individual (person granted asylum or refugee status).
                All others, including Anthropic and OpenAI's own employees on visas, are considered foreign nationals.
                The distinction for a company is not citizen vs non-citizen, but rather U.S. person vs foreign national.
            </p>

            <p>
                Assume that the export ban to foreign nationals stays, and a private company attempts to verify which of their customers are U.S. persons.
                Firstly, such company's API would likely need to be overhauled to allow for passthrough of each end users' unique identity verification ID.
                Secondly, the company would need to figure out how to verify documents to prove whether or not each user is a U.S. person.
                While many documents exist to "prove" being a U.S. citizen, not many can be independently verified by a private company at scale without access to restricted government databases.
            </p>

            <p>
                Asylee and refugee status is maintained in Department of Homeland Security records.
                The SAVE system can verify this status, but is accessible only to government agencies determining benefit eligibility, not private companies<sup><a href="#ref-save" className="underline">2</a></sup>.
                It also provides an imprecise status check rather than a document the individual possesses.
                For private entities, asylee and refugee status is simply unverifiable.
            </p>

            <p>
                Green cards come in a slip that says "We recommend use of this envelope to protect your new card and to prevent wireless communication with it."
                You may assume that this means it possible to electronically verify the status of green card holders, and while the card contains a chip, there is no way to validate that the information in the chip is authentic.
                Recent revisions of the green card contain a RFID chip, but the data inside this chip is an index into a government system rather than a true cryptographically signed identity<sup><a href="#ref-cdt" className="underline">3</a></sup>.
                A private company cannot robustly verify it with confidence the way it can verify a passport.
            </p>

            <p>
                Additionally, there are paper proofs of citizenship: birth certificates, Certificates of Naturalization, Certificates of Citizenship, and Consular Reports of Birth Abroad.
                These prove citizenship but they are all physical paper lacking any cryptographic validation.
                You <i>can</i> validate birth certificates via the EVVE system, which, similar to SAVE, is limited to government agencies<sup><a href="#ref-evve" className="underline">4</a></sup>.
                Even if private companies had access, participation is voluntary and incomplete, and records from non-participating jurisdictions simply cannot be verified.
            </p>

            <p>
                Ultimately, only one document withstands scrutiny: the passport.
                It is the sole proof of citizenship that is both exclusive to citizens (of which all are U.S. persons) and cryptographically verifiable by private parties.
                The passport is the result of a manual investigation previously conducted by the State Department.
                The passport encodes that completed investigation into a chip-based credential that can be validated almost instantly without needing access to government databases.
                All other documents are either unverifiable paper or database entries inaccessible to private entities.
            </p>


            <h2 className="text-tui-yellow mt-8 mb-2">Almost</h2>

            <p>
                Roughly 50% of Americans have a passport which would leave nearly half the country locked out of a system that requires a passport to access<sup><a href="#ref-passports" className="underline">5</a></sup>.
                You may ask about three other documents which were left out: a standard driver's license, a REAL ID, or a Social Security card.
            </p>
            <p>
                Social Security numbers are regularly issued to work-authorized visa holders who are foreign persons<sup><a href="#ref-ssn" className="underline">6</a></sup>.
                The Social Security card itself is a fragile paper document that is trivial to forge and lacks any chip-based validation.
                REAL IDs are commonly believed to confirm citizenship, but just like with Social Security cards they verify lawful presence in the country (again, visa holders who are foreign persons.)<sup><a href="#ref-realid" className="underline">7</a></sup>
                Standard driver's licenses provide even less information, with many states issuing them regardless of immigration status.
            </p>

            <p>
                There's two more documents you may have never heard of: passport cards and enhanced driver's licenses.
                Both documents encode citizenship but once again, there is no way to cryptographically verify the information is authentic.
                They both utilize long-range RFID tags, similar to the chip in a green card rather than the secure chip found in passport books.
                It contains no signed identity data and has been shown to be vulnerable to cloning attacks<sup><a href="#ref-rfid" className="underline">8</a></sup>.
                Among all documents that prove U.S. citizenship, only the passport book carries a chip that can be independently verified by private entities.
            </p>


            <h2 className="text-tui-yellow mt-8 mb-2">What the passport chip actually does</h2>

            <p>
                With every revision, the passport books physically get more secure, tamperproof, and harder to replicate.
                Security features like the Kinegram PCI are designed to be nearly impossible to reproduce, but none of this matters if you are simply taking a photo of the book.
                Countless fake passport generators exist online, and the fact that producing a fraudulent photo is trivial makes camera-based authentication useless.
            </p>
            <p>
                Since August 2007, the U.S. has only issued electronic passports which contain a RFID chip inside.
                As passports have a ten-year validity period, every passport in circulation has contained this chip since around 2017.
                I was under the assumption that it was added in the 2021 polycarbonate redesign, but that was purely physical hardening.
                The RFID chip inside the passport adheres to the ICAO Doc 9303 standard
                for machine-readable travel documents. For the contactless interface specifically, it uses ISO/IEC 14443, operating at 13.56 MHz with a typical read range of only a few centimeters.
                Unlike the printed page, the chip can cryptographically prove two things: that its contents are authentic and unaltered, and that the chip itself is genuine rather than a clone.
            </p>

            <p>
                Upon issuance, the government hashes your personal details, signs those hashes with its private key, and stores the signature on the chip.
                A reader verifies the signature against the re-hashed data using the government's public key.
                Any data alterations would cause the signature validation to fail.
                This concept is fairly intuitive - have the issuer sign the document fields and store the signature with the data to create a tamper-evident document.
                Notably, this is the step that U.S. driver's licenses still fail to implement.
                I argued in <Link to="/blog/insecure-by-design" className="underline">Insecure by Design</Link> that the AAMVA could and should sign driver's license barcode data using the same cryptographic approach the State Department uses for passport chips.
            </p>

            <p>
                The second purpose is to prove that the chip itself is genuine rather than a clone, and this is where the technology becomes quite remarkable.
                A cloned chip holding a copy of the signed data would still carry a valid government signature.
                To prevent this, the chip also contains a unique private key burned in during manufacturing and not readable externally.
                The reader issues a random challenge which the chip signs using this private key.
                The reader then verifies the response.
                A cloned chip, lacking the original private key, cannot produce a valid signature.
                The entire process is powered wirelessly by the reader, no batteries required.
                Pretty cool if you ask me.
            </p>

            <h2 className="text-tui-yellow mt-8 mb-2">Eliminating fraud is impossible</h2>

            <p>
                Eliminating fraud in a system like this is simply not possible, regardless of chip design, camera capabilities, or any level of engineering sophistication.
                Zero fraud is not an attainable goal.
                What we have instead is a spectrum, balancing the level of friction imposed on legitimate users against the level of fraud deemed tolerable.
                Every step taken to reduce fraud inevitably increases the burden placed on genuine users, and no amount of adjustment can drive fraud to zero.
                At best, it simply becomes prohibitively expensive.
            </p>

            <p>
                Consider the escalation of security measures.
                Starting with just a photograph of a passport offers virtually no friction but also virtually no security.
                Adding chip verification defeats forged and cloned documents but requires an NFC-capable phone and a tapping action.
                However, the chip only confirms the document's authenticity, not that the phone holder is the person described in the document.
                To bind the verified document to the live individual, a selfie with liveness detection is added.
                Notably, this is the first step that deviates from purely cryptographic methods.
                Facial matching relies on a model's probabilistic judgement.
                It inherently carries a non-zero false acceptance rate.
                At this point, we have transitioned from the realm of mathematical proof to the realm of statistical inference, and there is no path back.
                No facial recognition algorithm can match the certainty of a cryptographic signature.
            </p>

            <p>
                Continuing up the security ladder, the remaining vulnerability is that a verified individual could subsequently share their account with someone else.
                This could potentially be mitigated by mandating repeated verification every few hours, and it would likely be quite effective.
                However, no company would ever implement such a user-hostile policy.
                Forcing a paying customer to re-scan their passport multiple times per day is not a viable product strategy, it's a punishment.
                This single example encapsulates the core tradeoff: the measure that would meaningfully curtail fraud is intolerable from a user experience perspective, so it is never implemented, and thus some level of fraud is deliberately tolerated indefinitely.
                Additional security layers are added only up to the point where the next step would cost more users than it would save.
            </p>

            <p>
                Even if user experience was entirely disregarded and every safeguard was implemented simultaneously, an insurmountable barrier would still remain.
                Imagine having cryptographic proof of both an untampered video feed and a genuine, un-cloned passport.
                That would still not preclude the possibility of a cooperating individual holding a borrowed but authentic passport up to a camera.
                Each individual signal would be genuine - nothing in the digital realm would be forged.
                But the physical passport and the physical person would not correspond to the same individual.
                This gets to the crux of the issue: cryptography can prove facts about data, but it cannot prove facts about the physical world.
                It can confirm the authenticity of the chip and the video feed independently, but it can never confirm that they represent the same individual in the same physical space.
                Additional correlated sensors can be introduced to raise the cost and complexity of staging such a scene, but this only buys down risk probability - it does not achieve certainty.
                Certainty, in this context, is simply unattainable.
            </p>


            <h2 className="text-tui-yellow mt-8 mb-2">America</h2>

            <p>
                While writing this I found out an interesting fact: the United States does not have any sort of centralized citizenship registry, a deliberate policy choice sustained for decades on civil liberties grounds, which means that absent a universal, queryable database there is no straightforward way to definitively answer the question "Is this individual a U.S. citizen?"
                The contrast with France, home to Mistral AI, is instructive but needs care, because France's passport carries the same ICAO 9303 chip as the U.S. one, so the baseline is identical.
                The real gap is what sits on top: France issues a general-purpose national ID card to essentially all citizens, the chip-embedded CNIe, and built a government app, France Identité, that reads it over NFC and supports selective disclosure, so a French company in Anthropic's position could request an attestation stating simply "this individual is a French national" without a full passport scan or paper-based verification, whereas the U.S. has no analog at any level of adoption.
            </p>

            <p>
                Adoption itself is beside the point, since only about 525,000 of France's 3.2 million registered digital identities are certified at the highest assurance level a private party could rely on, in a population near 68 million<sup><a href="#ref-france" className="underline">9</a></sup>; the difference is the existence of a functional architecture rather than its uptake, and the U.S. has nothing comparable to scale because the system was never built.
                Even France's solution is narrower than it appears, since France Identité is restricted to nationals and a lawful resident on a titre de séjour cannot use it, so it answers the citizen question rather than the broader person question that the export directive actually poses.
            </p>


            <h2 className="text-tui-yellow mt-8 mb-2">Persona</h2><p>
                Anthropic already operates an identity verification pipeline, which serves as a useful case study for the capabilities and limitations of verification systems.
                For basic age verification, Anthropic utilizes a vendor called Yoti, which returns only a binary pass/fail result without ever sharing the underlying document with Anthropic.
                For comprehensive identity verification, Anthropic employs Persona, which matches a government-issued ID to a live selfie.
            </p>

            <p>
                It would be easy to assume that Persona is simply incapable of verifying citizenship status, but that would be incorrect.
                Persona is more sophisticated than that.
                It has the ability to read the NFC chips in e-passports, performing the same cryptographic signature validation described earlier, for passports and ID cards from over 120 countries<sup><a href="#ref-persona-nfc" className="underline">10</a></sup>.
                Persona itself acknowledges the weakness of printed passport pages, susceptible to forgery, and emphasizes the chip as the true security measure<sup><a href="#ref-persona-blog" className="underline">11</a></sup>.
                Therefore, the narrow technical capability exists.
                A verification flow that exclusively accepted U.S. passports and validated their chips would effectively function as a citizenship gate, as a cryptographically authenticated U.S. passport is proof of citizenship.
                The technology to implement this exists today, off-the-shelf.
            </p>

            <p>
                This demonstrates that technology was never the true obstacle.
                The real barriers are all the factors discussed throughout this piece.
                Such a citizenship verification gate would exclude roughly half of all U.S. citizens who do not hold passports, as well as all green card holders, asylees, and refugees, despite them all being lawful U.S. persons fully entitled to access.
                The reason Persona's standard verification flow accepts driver's licenses and state IDs is because those are the documents that most people actually possess, yet none of those documents can conclusively prove U.S. person status.
                While it would be possible to restrict the verification flow to only accept passport-based chip authentication, doing so would lock out the majority of legitimate users that the regulation is intended to include.
                The technology is capable of performing the narrow citizenship verification, but not without unacceptably excluding most authorized individuals.
                That is the fundamental limitation, and it is not a limitation of software.
            </p>

            <p>
                It's important to be precise about the nature of this verification program.
                Anthropic characterizes it as an anti-fraud and age assurance measure targeting a small subset of flagged accounts, not a broad citizenship verification system, and links it to a distinct issue: a reported exfiltration campaign conducted through tens of thousands of fraudulent accounts.
                Anthropic states that this verification program is not related to the export control conflict.
                Nevertheless, the timing of the implementation invites speculation, and some reports have suggested identity verification as the eventual path to restoring U.S. user access to Fable.
                But even in that hypothetical future scenario, verification would be merely one factor Anthropic would present to the government in a petition for authorization.
                It is not a unilateral action that Anthropic can independently take to resolve the issue.
                And there is a more fundamental reason why verification alone can never be a complete solution: comparable capabilities are increasingly accessible through open-source models distributed as raw weights, which cannot be revoked and cannot be restricted based on user nationality.
                Access restrictions based on user identity are only applicable to closed models in the first place.
                The approach presumes a level of control that the broader field is progressively eroding.
            </p>


            <h2 className="text-tui-yellow mt-8 mb-2">100</h2>

            <p>
                When confronted with the question of who could lawfully be served, the government and Anthropic did not implement per-user citizenship verification.
                Instead, the Trump administration hand-selected approximately one hundred trusted institutions and explicitly restricted access to that list, within the United States.
            </p>

            <p>
                This resolution itself encapsulates the core argument.
                The practical solution was not "any verified U.S. person" but rather "roughly one hundred explicitly designated organizations."
                This is because the former is fundamentally infeasible while the latter is actionable.
                And it's critical to recognize the true nature of this carve-out: it represents a determination about who can be entrusted with a capability, executed through the adjustment of an export directive that could only be expressed in terms of nationality.
                It is the government finally directly addressing its actual concern, after a nationality-based instrument had crudely forced everything offline as an initial response.
                Fable, whose core purpose was broad public access, remains dark precisely because broad public access is the central point of contention, and no credential carried by any individual can resolve that underlying dispute.
            </p>

            <p>
                Thus, we are left with a convoluted situation.
                A government concerned about a specific capability reached for a nationality-based regulatory tool.
                That nationality-based restriction, in turn, required a form of identity verification that the country had, through its own sustained policy choices, made impossible to implement.
                The infeasible requirement resulted in a blanket shutdown that impacted the very citizens it was never intended to affect.
                And the eventual policy accommodation circumvented individualized verification entirely in favor of an explicitly enumerated allotment.
                The verification challenge, ultimately, was not truly a verification problem at all.
                It was a question the United States had deliberately made itself unable to answer, asked through a mechanism that could only pose it in the one format the country was least prepared to handle, via a process opaque enough to leave us still uncertain whether the primary motivation was technological risk or political considerations.
            </p>


            <div className="mt-8 pt-4" style={{ borderTop: '1px solid var(--tui-border)' }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--tui-bright)' }}>References</h2>
                <ol className="space-y-3 text-sm" style={{ color: 'var(--tui-dim)' }}>
                    <li id="ref-classifiers" className="leading-relaxed">
                        Anthropic. (2026, January 9). <i>Next-generation Constitutional Classifiers: More efficient protection against universal jailbreaks</i>.{' '}
                        <a href="https://www.anthropic.com/research/next-generation-constitutional-classifiers" target="_blank" rel="noopener noreferrer" className="underline break-all">
                            https://www.anthropic.com/research/next-generation-constitutional-classifiers
                        </a>
                    </li>
                    <li id="ref-save" className="leading-relaxed">
                        American Immigration Council. (2026, April 3). <i>The Systematic Alien Verification for Entitlements (SAVE) Program: A Fact Sheet</i>.{' '}
                        <a href="https://www.americanimmigrationcouncil.org/report/systematic-alien-verification-entitlements-save-program-fact-sheet/" target="_blank" rel="noopener noreferrer" className="underline break-all">
                            https://www.americanimmigrationcouncil.org/report/systematic-alien-verification-entitlements-save-program-fact-sheet/
                        </a>
                    </li>
                    <li id="ref-cdt" className="leading-relaxed">
                        Center for Democracy and Technology. (2008). <i>Security and Privacy Issues Associated With Federal RFID-Enabled Documents</i>.{' '}
                        <a href="https://cdt.org/insights/security-and-privacy-issues-associated-with-federal-rfid-enabled-documents/" target="_blank" rel="noopener noreferrer" className="underline break-all">
                            https://cdt.org/insights/security-and-privacy-issues-associated-with-federal-rfid-enabled-documents/
                        </a>
                    </li>
                    <li id="ref-evve" className="leading-relaxed">
                        AAMVA. (n.d.). <i>Validating Vitals</i>. Move Magazine.{' '}
                        <a href="https://movemag.org/validating-vitals/" target="_blank" rel="noopener noreferrer" className="underline break-all">
                            https://movemag.org/validating-vitals/
                        </a>
                    </li>
                    <li id="ref-passports" className="leading-relaxed">
                        U.S. Department of State, Bureau of Consular Affairs. (n.d.). <i>Reports and Statistics</i>.{' '}
                        <a href="https://travel.state.gov/content/travel/en/about-us/reports-and-statistics.html" target="_blank" rel="noopener noreferrer" className="underline break-all">
                            https://travel.state.gov/content/travel/en/about-us/reports-and-statistics.html
                        </a>
                    </li>
                    <li id="ref-ssn" className="leading-relaxed">
                        Social Security Administration. (n.d.). <i>Foreign Workers and Social Security Numbers</i> (Publication No. 05-10107).{' '}
                        <a href="https://www.ssa.gov/pubs/EN-05-10107.pdf" target="_blank" rel="noopener noreferrer" className="underline break-all">
                            https://www.ssa.gov/pubs/EN-05-10107.pdf
                        </a>
                    </li>
                    <li id="ref-realid" className="leading-relaxed">
                        Biometric Update. (2026, January 7). <i>DHS agent tells court REAL ID can't be used to confirm US citizenship</i>.{' '}
                        <a href="https://www.biometricupdate.com/202601/dhs-agent-tells-court-real-id-cant-be-used-to-confirm-us-citizenship" target="_blank" rel="noopener noreferrer" className="underline break-all">
                            https://www.biometricupdate.com/202601/dhs-agent-tells-court-real-id-cant-be-used-to-confirm-us-citizenship
                        </a>
                    </li>
                    <li id="ref-rfid" className="leading-relaxed">
                        Koscher, K., Juels, A., Brajkovic, V., &amp; Kohno, T. (2009). <i>EPC RFID Tags in Security Applications: Passport Cards, Enhanced Drivers Licenses, and Beyond</i>. University of Washington / RSA Laboratories.{' '}
                        <a href="https://www.aclu.org/news/national-security/privacy-and-security-concerns-washingtons-enhanced-drivers-license" target="_blank" rel="noopener noreferrer" className="underline break-all">
                            https://www.aclu.org/news/national-security/privacy-and-security-concerns-washingtons-enhanced-drivers-license
                        </a>
                    </li>
                    <li id="ref-france" className="leading-relaxed">
                        Biometric Update. (2025, December 5). <i>France's national digital ID scaling up after graduating from pilot</i>.{' '}
                        <a href="https://www.biometricupdate.com/202512/frances-national-digital-id-scaling-up-after-graduating-from-pilot" target="_blank" rel="noopener noreferrer" className="underline break-all">
                            https://www.biometricupdate.com/202512/frances-national-digital-id-scaling-up-after-graduating-from-pilot
                        </a>
                    </li>
                    <li id="ref-persona-nfc" className="leading-relaxed">
                        Persona. (n.d.). <i>Passport NFC Chip Verification Solution</i>.{' '}
                        <a href="https://withpersona.com/product/verifications/nfc" target="_blank" rel="noopener noreferrer" className="underline break-all">
                            https://withpersona.com/product/verifications/nfc
                        </a>
                    </li>
                    <li id="ref-persona-blog" className="leading-relaxed">
                        Persona. (2026, January 21). <i>A better customer verification process: how Persona is paving the way with NFC, mDL, and other new technologies</i>.{' '}
                        <a href="https://withpersona.com/blog/a-better-customer-verification-process-how-persona-is-paving-the-way-with-nfc-mdl-and-other-new-technologies" target="_blank" rel="noopener noreferrer" className="underline break-all">
                            https://withpersona.com/blog/a-better-customer-verification-process-how-persona-is-paving-the-way-with-nfc-mdl-and-other-new-technologies
                        </a>
                    </li>
                </ol>
            </div>


        </BlogPost>
    );
};

export default DoYouKYC;