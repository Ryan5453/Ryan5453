import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TerminalWindow from './components/TerminalWindow';
import { scan, ScanError, warmUp } from './lib/scanClient';
import type { CardFinding, Group } from './lib/donate';

/**
 * Help find a missing key, without handing anyone your ID.
 *
 * Several jurisdictions sign their barcodes and publish no key to check the
 * signature against. The key can be recovered from signed cards — two are enough —
 * and the arithmetic needs only the signature and the bytes it covers. It never
 * touches the name, the address, the licence number or the photograph.
 *
 * So this page does the recovery here, in the browser, and shows only the key. The
 * card data is read into memory to compute a hash and is never displayed, never
 * stored and never sent. What comes out the other end is a 33-byte public key, which
 * is a fact about the DMV and not about the person holding the card.
 */
const Recover: React.FC = () => {
  const navigate = useNavigate();
  const [findings, setFindings] = useState<CardFinding[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [busy, setBusy] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const addFiles = useCallback(async (files: File[]) => {
    if (!files.length) return;
    setBusy((n) => n + files.length);
    const { examine, tally, markDuplicates } = await import('./lib/donate');
    const results: CardFinding[] = [];
    for (const file of files) {
      try {
        results.push(await examine(file.name, await scan(file)));
      } catch (e) {
        results.push({
          name: file.name,
          iin: '',
          jurisdiction: 'unreadable',
          problem: e instanceof ScanError ? e.message : (e as Error).message,
        });
      }
      setBusy((n) => n - 1);
    }
    setFindings((prev) => {
      const all = markDuplicates([...prev, ...results]);
      setGroups(tally(all.filter((f) => !f.duplicateOf)));
      return all;
    });
  }, []);

  const pick = (list: FileList | null) => list && void addFiles([...list]);

  const copy = async () => {
    const { report } = await import('./lib/donate');
    await navigator.clipboard.writeText(report(groups));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusBar = (
    <>
      <Link to="/blog/keys-not-included" className="shortcut-link">
        <span className="text-tui-yellow">[b]</span>ack to the post
      </Link>
      <span className="text-tui-dim">
        {findings.length ? `${findings.length} image(s) · nothing uploaded` : 'nothing uploaded'}
      </span>
    </>
  );

  return (
    <TerminalWindow
      title="ryan@ryan.science: ~/blog/keys-not-included/recover"
      statusBar={statusBar}
      maxWidth="max-w-3xl"
    >
      <div className="font-mono text-sm">
        <h1 className="text-tui-bright text-lg mb-2">Recover a signing key</h1>
        <p className="text-tui-dim mb-6 leading-relaxed max-w-2xl">
          North Carolina, South Carolina and Wisconsin sign their barcodes with a key nobody
          has published. With ECDSA key recovery, multiple signed barcodes allow you to recover
          the public key used to sign those barcodes.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void addFiles([...e.dataTransfer.files]);
          }}
          className="mb-6 p-8 text-center"
          style={{
            border: `1px dashed ${dragging ? 'var(--tui-cyan)' : 'var(--tui-border)'}`,
            background: dragging ? 'var(--tui-bg-hl)' : 'var(--tui-bg)',
          }}
        >
          <p className="mb-4" style={{ color: 'var(--tui-dim)' }}>
            drop photos here, or
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => cameraInput.current?.click()} className="tui-button">
              take a photo
            </button>
            <button onClick={() => fileInput.current?.click()} className="tui-button">
              choose files
            </button>
          </div>
          <input
            ref={cameraInput}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => pick(e.target.files)}
          />
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => pick(e.target.files)}
          />
          {busy > 0 && (
            <p className="mt-4" style={{ color: 'var(--tui-cyan)' }}>
              reading {busy} image{busy === 1 ? '' : 's'}…
            </p>
          )}
        </div>

        {groups.map((g) => (
          <div key={`${g.iin}/${g.field}`} className="tui-panel mb-4">
            <span className="tui-panel-title font-mono">
              {g.jurisdiction} · field {g.field}
            </span>
            <div className="text-xs leading-relaxed">
              {/*
                Once two cards agree the answer is the key, so show the key. The losing
                candidates are an artefact of how recovery works, not information.
              */}
              {g.settled ? (
                <div className="break-all mono-read" style={{ color: 'var(--tui-green)' }}>
                  {g.settled}
                </div>
              ) : (
                <>
                  <p style={{ color: 'var(--tui-yellow)' }}>
                    {g.cards < 2
                      ? 'One card narrows it to two. Add another from this state.'
                      : 'No two cards agree yet. Add another.'}
                  </p>
                  <div className="mt-2 space-y-1">
                    {g.clusters.map((c) => (
                      <div key={c.key} className="break-all mono-read" style={{ color: 'var(--tui-text)' }}>
                        {c.key}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {groups.length > 0 && (
          <div className="mb-6 flex gap-3 items-center flex-wrap">
            <button onClick={() => void copy()} className="tui-button">
              {copied ? 'copied' : 'copy the keys'}
            </button>
            <span className="text-xs" style={{ color: 'var(--tui-dim)' }}>
              then send them to{' '}
              <a href="mailto:ryan@ryan.science" className="underline">
                ryan@ryan.science
              </a>
            </span>
          </div>
        )}

        {findings.length > 0 && (
          <div className="tui-panel mb-6">
            <span className="tui-panel-title font-mono">images</span>
            <div className="text-xs leading-relaxed">
              {findings.map((f, i) => (
                <div key={`${f.name}-${i}`} className="flex gap-3 leading-6 flex-wrap">
                  <span className="inline-block w-48 shrink-0 truncate" style={{ color: 'var(--tui-magenta)' }}>
                    {f.name}
                  </span>
                  <span style={{ color: f.problem ? 'var(--tui-yellow)' : 'var(--tui-dim)' }}>
                    {f.duplicateOf
                      ? `same card as ${f.duplicateOf}, counted once`
                      : (f.problem ?? `${f.jurisdiction} · ${f.signatureBytes}-byte signature in ${f.field}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </TerminalWindow>
  );
};

export default Recover;
