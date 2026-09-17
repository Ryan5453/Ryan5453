import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TerminalWindow from './components/TerminalWindow';
import { parseAamva, ELEMENT_NAMES, IIN_NAMES, AamvaError } from './lib/aamva';
import type { Card } from './lib/aamva';
import { verifyCard, ISSUERS } from './lib/verifyId';
import type { Verdict } from './lib/verifyId';
import type { CaResult } from './lib/verifyCalifornia';
import { scan, ScanError, warmUp } from './lib/scanClient';

/**
 * A license checker that works from a photograph, and runs entirely in the browser.
 *
 * It takes an image rather than pasted text on purpose. Pasted text is something you
 * already had to obtain with a scanner app, which both narrows who can use this and
 * quietly moves the interesting step off the page. Taking the photo here makes the
 * whole chain visible: decode the barcode, parse the fields, check the signature.
 *
 * Two different things happen. Parsing works for every AAMVA jurisdiction, because
 * the format is a published standard. Verification works for four — New York,
 * Virginia and North Carolina, whose keys had to be recovered rather than read, and
 * California, which publishes everything needed.
 *
 * Everywhere else splits in two, and the split is read off the card rather than
 * assumed. Some jurisdictions sign and publish nothing: the signature is in the
 * payload and there is no key to check it against, which is the subject of the post.
 * Others carry no signature at all. Reporting both as "nothing to check" was wrong,
 * and wrong in the direction that flatters the card.
 *
 * Nothing is uploaded. The California path fetches one public key document from the
 * DMV; the image and the license data never leave the page.
 */

const CA_IIN = '636014';

type Stage =
  | { kind: 'idle' }
  | { kind: 'scanning' }
  | { kind: 'failed'; message: string; hint?: string }
  | { kind: 'done'; card: Card; verdict: Verdict | null; ca: CaResult | null; busy: boolean };

const Verify: React.FC = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>({ kind: 'idle' });
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    warmUp();
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'b') navigate('/blog/keys-not-included');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const handleFile = useCallback(async (file: File) => {
    setStage({ kind: 'scanning' });
    let raw: string;
    try {
      raw = await scan(file);
    } catch (e) {
      setStage({
        kind: 'failed',
        message: e instanceof ScanError ? e.message : (e as Error).message,
      });
      return;
    }

    let card: Card;
    try {
      card = parseAamva(raw);
    } catch (e) {
      setStage({
        kind: 'failed',
        message: e instanceof AamvaError ? e.message : (e as Error).message,
        hint: 'The barcode decoded, but it is not an AAMVA license payload.',
      });
      return;
    }

    setStage({ kind: 'done', card, verdict: null, ca: null, busy: true });

    if (card.iin === CA_IIN) {
      // Loaded on demand: the credential stack is large and no other page needs it.
      const { verifyCalifornia } = await import('./lib/verifyCalifornia');
      const ca = await verifyCalifornia(raw);
      setStage({ kind: 'done', card, verdict: null, ca, busy: false });
    } else {
      const verdict = await verifyCard(card);
      setStage({ kind: 'done', card, verdict, ca: null, busy: false });
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const statusBar = (
    <>
      <Link to="/blog/keys-not-included" className="shortcut-link">
        <span className="text-tui-yellow">[b]</span>ack to the post
      </Link>
      <span className="text-tui-dim">
        verifiable: {ISSUERS.map((i) => i.jurisdiction).join(' · ')} · California
      </span>
    </>
  );

  return (
    <TerminalWindow title="ryan@ryan.science: ~/blog/keys-not-included/verify" statusBar={statusBar}>
      <div className="font-mono text-sm">
        <h1 className="text-tui-bright text-lg mb-2">ID signature validator</h1>
        <p className="text-tui-dim mb-6 leading-relaxed max-w-2xl">
        This tool can parse data from any U.S. or Canadian jurisdiction, but only New York, Virginia, North Carolina and California can be cryptographically verified.
            Your photos stay local and no data is uploaded; you can audit the source code <Link className="underline" to="https://github.com/Ryan5453/Ryan5453">here</Link>.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className="mb-6 p-8 text-center"
          style={{
            border: `1px dashed ${dragging ? 'var(--tui-cyan)' : 'var(--tui-border)'}`,
            background: dragging ? 'var(--tui-bg-hl)' : 'var(--tui-bg)',
          }}
        >
          <p className="mb-4" style={{ color: 'var(--tui-dim)' }}>
            drop a photo here, or
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => cameraInput.current?.click()} className="tui-button">
              take a photo
            </button>
            <button onClick={() => fileInput.current?.click()} className="tui-button">
              choose a file
            </button>
          </div>
          <input
            ref={cameraInput}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && void handleFile(e.target.files[0])}
          />
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && void handleFile(e.target.files[0])}
          />
        </div>

        {stage.kind === 'scanning' && (
          <Panel title="reading">
            <span style={{ color: 'var(--tui-dim)' }}>decoding the barcode…</span>
          </Panel>
        )}

        {stage.kind === 'failed' && (
          <Panel title="could not read it" accent="var(--tui-red)">
            {stage.hint && (
              <p className="mb-2" style={{ color: 'var(--tui-text)' }}>
                {stage.hint}
              </p>
            )}
            <p style={{ color: 'var(--tui-dim)' }}>{stage.message}</p>
          </Panel>
        )}

        {stage.kind === 'done' && (
          <>
            <Verdicts stage={stage} />
            <Panel title="card data">
              <Header card={stage.card} />
              <Elements card={stage.card} ca={stage.ca} />
            </Panel>
          </>
        )}
      </div>
    </TerminalWindow>
  );
};

/** AAMVA dates are MMDDCCYY. Shown only to explain a mismatch, so keep it plain. */
function formatDate(raw: string): string {
  const m = /^(\d{2})(\d{2})(\d{4})$/.exec(raw.trim());
  if (!m) return raw;
  const d = new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]));
  return Number.isNaN(d.getTime())
    ? raw
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const Panel: React.FC<{ title: string; accent?: string; children: React.ReactNode }> = ({
  title,
  accent,
  children,
}) => (
  <div className="tui-panel mb-6" style={accent ? { borderColor: accent } : undefined}>
    <span className="tui-panel-title font-mono" style={accent ? { color: accent } : undefined}>
      {title}
    </span>
    <div className="text-xs leading-relaxed">{children}</div>
  </div>
);

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex gap-3 leading-6">
    <span className="inline-block w-40 shrink-0" style={{ color: 'var(--tui-dim)' }}>
      {label}
    </span>
    <span style={{ color: 'var(--tui-text)' }}>{children}</span>
  </div>
);

const Header: React.FC<{ card: Card }> = ({ card }) => (
  <div className="mb-4">
    <Row label="jurisdiction">
      <span style={{ color: 'var(--tui-bright)' }}>{IIN_NAMES[card.iin] ?? 'unrecognised'}</span>
      <span style={{ color: 'var(--tui-dim)' }}> · IIN {card.iin}</span>
    </Row>
    <Row label="AAMVA version">{card.aamvaVersion}</Row>
    <Row label="subfiles">
      {card.subfiles.map((s) => `${s.type} (${s.elements.length} elements)`).join(', ')}
    </Row>
  </div>
);

/** The verdict is the point of the page, so it leads and states its reasoning. */
const Verdicts: React.FC<{ stage: Extract<Stage, { kind: 'done' }> }> = ({ stage }) => {
  const { card, verdict, ca, busy } = stage;

  if (busy) {
    return (
      <Panel title="checking">
        <span style={{ color: 'var(--tui-dim)' }}>verifying the signature…</span>
      </Panel>
    );
  }

  if (ca) {
    if (ca.status === 'valid') {
      return (
        <Panel title="signature valid" accent="var(--tui-green)">
          <p style={{ color: 'var(--tui-green)' }}>
            This barcode carries a genuine California signature.
          </p>
          <p className="mt-2" style={{ color: 'var(--tui-dim)' }}>
            Checked against California's published key, {ca.verificationMethod}. The issuer was
            pinned to the DMV's own identifier before the signature was checked. Without that,
            a forger could sign their own card and point at their own key.
          </p>
          {ca.unprotectedFields?.length ? (
            <p className="mt-3" style={{ color: 'var(--tui-orange)' }}>
              The signature covers {ca.protectedFields?.length} fields. It does <b>not</b> cover{' '}
              {ca.unprotectedFields.join(', ')}, which can be altered without breaking it.
            </p>
          ) : null}
        </Panel>
      );
    }
    if (ca.status === 'absent') {
      return (
        <Panel title="no signature" accent="var(--tui-yellow)">
          <p style={{ color: 'var(--tui-yellow)' }}>{ca.detail}</p>
        </Panel>
      );
    }
    if (ca.status === 'error') {
      return (
        <Panel title="could not check it" accent="var(--tui-yellow)">
          <p style={{ color: 'var(--tui-yellow)' }}>
            Something went wrong checking this card, so it is neither passed nor failed.
          </p>
          <p className="mt-2" style={{ color: 'var(--tui-dim)' }}>{ca.detail}</p>
        </Panel>
      );
    }
    return (
      <Panel title="not a genuine California ID" accent="var(--tui-red)">
        <p style={{ color: 'var(--tui-red)' }}>
          The signature on this card does <b>not</b> check out against California's published
          key. A real California license issued since 29 September 2025 would.
        </p>
        <p className="mt-2" style={{ color: 'var(--tui-dim)' }}>
          The fields below are what the barcode claims. Nothing vouches for them.
        </p>
        <p className="mt-2" style={{ color: 'var(--tui-dim)' }}>
          {ca.detail}
        </p>
      </Panel>
    );
  }

  if (!verdict) return null;

  switch (verdict.status) {
    case 'valid':
      return (
        <Panel title="signature valid" accent="var(--tui-green)">
          <p style={{ color: 'var(--tui-green)' }}>
            This barcode carries a genuine {verdict.issuer.jurisdiction} signature.
          </p>
          <p className="mt-2" style={{ color: 'var(--tui-dim)' }}>
            {verdict.signatureBytes}-byte ECDSA P-256 signature in field {verdict.issuer.field},
            checked against a key recovered from real cards. {verdict.issuer.vendor} has never
            published it. Alter any byte of the payload and this check fails.
          </p>
        </Panel>
      );
    case 'unmatched':
      return (
        <Panel title="signature matches no known key" accent="var(--tui-red)">
          <p style={{ color: 'var(--tui-red)' }}>
            This card carries a {verdict.signatureBytes}-byte signature, and it does not check
            out against any key I have for {verdict.issuer.jurisdiction}.
          </p>
          <p className="mt-2" style={{ color: 'var(--tui-dim)' }}>
            The likely explanation is a counterfeit: one that copies the layout fails here even
            when it convinces the eye.
          </p>
          <p className="mt-2" style={{ color: 'var(--tui-dim)' }}>
            But it is not the only one, and this tool will not pretend otherwise. Keys get
            rotated, and a genuine card signed under a retired key lands in exactly this
            panel.{' '}
            {verdict.issued
              ? `This one says it was issued ${formatDate(verdict.issued)}. `
              : ''}
            {verdict.issuer.jurisdiction} publishes no key and no rotation schedule, so there
            is no way from here to tell the two apart. If you believe this card is real,{' '}
            <Link to="/blog/keys-not-included/recover" className="underline">
              it can help find the missing key
            </Link>
            .
          </p>
        </Panel>
      );
    case 'malformed':
      return (
        <Panel title="signature unreadable" accent="var(--tui-red)">
          <p style={{ color: 'var(--tui-red)' }}>{verdict.detail}</p>
        </Panel>
      );
    case 'missing':
      return (
        <Panel title="no signature" accent="var(--tui-yellow)">
          <p style={{ color: 'var(--tui-yellow)' }}>
            {verdict.issuer.jurisdiction} signs its barcodes, but field {verdict.issuer.field} is
            absent here, so there is nothing to check.
          </p>
          <p className="mt-2" style={{ color: 'var(--tui-dim)' }}>
            A current card should carry one. An older card issued before the state started
            signing legitimately does not, and licenses last the better part of a decade, so plenty
            of unsigned ones are still valid. Absence is not evidence of a forgery here.
          </p>
        </Panel>
      );
    case 'unsupported':
      return (
        <Panel title="cannot be checked" accent="var(--tui-yellow)">
          <p style={{ color: 'var(--tui-yellow)' }}>{verdict.detail}</p>
        </Panel>
      );
    case 'unkeyed':
      return (
        <Panel title="signed, but not checkable" accent="var(--tui-yellow)">
          <p style={{ color: 'var(--tui-yellow)' }}>
            This card is signed. Field {verdict.field} holds a {verdict.signatureBytes}-byte
            ECDSA signature.
          </p>
          <p className="mt-2" style={{ color: 'var(--tui-dim)' }}>
            {IIN_NAMES[card.iin] ?? 'This jurisdiction'} does not publish the key, and this is
            not one of the two I recovered, so the signature is sitting right there and there
            is no way to tell whether it is good. That gap is the subject of the post.
          </p>
          <p className="mt-2" style={{ color: 'var(--tui-dim)' }}>
            The key can be worked out from two signed cards, using only the signature and the
            bytes it covers, never who the card belongs to.{' '}
            <Link to="/blog/keys-not-included/recover" className="underline">
              You can help find it
            </Link>
            , without showing anyone your ID.
          </p>
        </Panel>
      );
    default:
      return (
        <Panel title="nothing to check" accent="var(--tui-dim)">
          <p style={{ color: 'var(--tui-text)' }}>
            No signature field in this payload, so there is nothing to check. The data below is
            parsed but unauthenticated: anyone can write a barcode that says anything.
          </p>
          <p className="mt-2" style={{ color: 'var(--tui-dim)' }}>
            That is a statement about this card, not about{' '}
            {IIN_NAMES[card.iin] ?? 'the jurisdiction'}: a state can start signing at any time,
            and several sign without ever saying so.
          </p>
        </Panel>
      );
  }
};

const Elements: React.FC<{ card: Card; ca: CaResult | null }> = ({ card, ca }) => (
  <>
    {card.subfiles.map((sub) => (
      <div key={sub.type} className="mb-4">
        <div className="mb-1" style={{ color: 'var(--tui-cyan)' }}>
          {sub.type} subfile
        </div>
        {sub.elements.map((el) => {
          /*
           * Only annotate coverage when the signature actually verified. On a card
           * that failed, "signed" beside a field is a lie the forger gets to tell:
           * the bitstring claiming which fields are covered is itself unsigned data.
           */
          const trusted = ca?.status === 'valid';
          const covered = trusted && ca?.protectedFields?.includes(el.code);
          const uncovered = trusted && ca?.unprotectedFields?.includes(el.code);
          return (
            <div key={el.code + el.valueStart} className="flex gap-3 leading-6">
              <span className="inline-block w-12 shrink-0" style={{ color: 'var(--tui-magenta)' }}>
                {el.code}
              </span>
              <span className="inline-block w-40 shrink-0" style={{ color: 'var(--tui-dim)' }}>
                {ELEMENT_NAMES[el.code] ?? ''}
              </span>
              <span className="break-all mono-read" style={{ color: 'var(--tui-text)' }}>
                {el.value.length > 96 ? `${el.value.slice(0, 96)}…` : el.value || '—'}
              </span>
              {covered && (
                <span className="shrink-0" style={{ color: 'var(--tui-green)' }}>
                  signed
                </span>
              )}
              {uncovered && (
                <span className="shrink-0" style={{ color: 'var(--tui-orange)' }}>
                  unsigned
                </span>
              )}
            </div>
          );
        })}
      </div>
    ))}
  </>
);

export default Verify;
