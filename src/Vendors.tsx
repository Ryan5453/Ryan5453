import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TerminalWindow from './components/TerminalWindow';
import JurisdictionMap from './components/JurisdictionMap';
import { cardProducer, vendors, signatures } from './data/cardProducers';

/**
 * The vendor map, on its own page.
 *
 * It lived at the foot of the post, which was the wrong place for it twice over: it
 * is wider than the prose column and wanted to bleed out of it, and it is a reference
 * anyone might want without reading three thousand words first.
 *
 * It gets the terminal chrome rather than the article layout, because it is a tool
 * like the checker is, not a piece of writing — the serif masthead belongs to the post.
 */
const Vendors: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'b') navigate('/blog/keys-not-included');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const statusBar = (
    <>
      <Link to="/blog/keys-not-included" className="shortcut-link">
        <span className="text-tui-yellow">[b]</span>ack to the post
      </Link>
      <span className="text-tui-dim">69 jurisdictions · 6 producers</span>
    </>
  );

  return (
    <TerminalWindow
      title="ryan@ryan.science: ~/blog/keys-not-included/vendors"
      statusBar={statusBar}
      maxWidth="max-w-[960px]"
    >
      <div className="font-mono text-sm">
        <h1 className="text-tui-bright text-lg mb-6">Who prints your ID</h1>
        <JurisdictionMap assignments={cardProducer} categories={vendors} signed={signatures} />
      </div>
    </TerminalWindow>
  );
};

export default Vendors;
