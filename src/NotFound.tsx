import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TerminalWindow from './components/TerminalWindow';
import { posts } from './posts';

/**
 * 404, in the shell's own idiom: a shell reports a bad path by quoting it back at
 * you, so this does too rather than showing a decorative number. It also offers the
 * places worth going, because a dead end with no exits is the actual failure.
 */
const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'h') navigate('/');
      if (e.key === 'b') navigate('/blog');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  /**
   * Every route the site actually serves. Posts are generated from the same list the
   * router uses, so a new post appears here without anyone remembering to add it;
   * the standalone pages are listed by hand because there are few of them.
   */
  const ROUTES: { to: string; note: string; indent?: boolean }[] = [
    { to: '/', note: 'home' },
    { to: '/blog', note: `${posts.length} post(s)` },
    ...posts.map(({ meta }) => ({
      to: `/blog/${meta.slug}`,
      note: meta.title,
      indent: true,
    })),
    {
      to: '/blog/keys-not-included/vendors',
      note: 'who prints every North American ID',
      indent: true,
    },
    {
      to: '/blog/keys-not-included/verify',
      note: 'check a license barcode signature',
      indent: true,
    },
    {
      to: '/blog/keys-not-included/recover',
      note: 'help recover a missing signing key',
      indent: true,
    },
    { to: '/lastfm', note: "what i've been listening to" },
  ];

  const statusBar = (
    <>
      <Link to="/" className="shortcut-link">
        <span className="text-tui-yellow">[h]</span>ome
      </Link>
      <Link to="/blog" className="shortcut-link">
        <span className="text-tui-yellow">[b]</span>log
      </Link>
      <span className="text-tui-dim">404</span>
    </>
  );

  return (
    <TerminalWindow title="ryan@ryan.science: ~" statusBar={statusBar}>
      <div className="font-mono text-sm">
        <div className="mb-6">
          <span className="text-tui-green">$</span>{' '}
          <span style={{ color: 'var(--tui-text)' }}>cat</span>{' '}
          <span style={{ color: 'var(--tui-bright)' }}>{pathname}</span>
        </div>
        <p className="mb-8" style={{ color: 'var(--tui-red)' }}>
          cat: {pathname}: No such file or directory
        </p>

        <p className="mb-3" style={{ color: 'var(--tui-dim)' }}>
          Try one of these instead:
        </p>
        <ul className="space-y-1 mb-8">
          {ROUTES.map(({ to, note, indent }) => (
            <li key={to} className={indent ? 'pl-4' : undefined}>
              <Link to={to} className="hover:underline" style={{ color: 'var(--tui-cyan)' }}>
                {to}
              </Link>
              <span style={{ color: 'var(--tui-dim)' }}> — {note}</span>
            </li>
          ))}
        </ul>
      </div>
    </TerminalWindow>
  );
};

export default NotFound;
