import React, { ReactNode, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Everything a post knows about itself. Declared once, in the post's own file,
 * and consumed by the article header, the blog index, and the router — so a
 * title, date or slug cannot disagree with itself across files.
 */
export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  /**
   * Companion pages belonging to this post — an interactive figure, a tool. They sit
   * under the byline rather than in the body so they are reachable immediately,
   * without hunting for the paragraph that happens to mention them.
   *
   * `key` is the part of `label` to bracket, the way the rest of the site writes its
   * shortcuts. Usually one letter; a whole word works too, when the letter alone
   * would not say what the page does. Either way the keyboard binds to its first
   * character, and because the bracket is found inside the label rather than written
   * out separately, the shortcut shown and the shortcut bound cannot drift apart.
   */
  links?: { to: string; label: string; key: string }[];
}

interface BlogPostProps {
  meta: PostMeta;
  children: ReactNode;
}

const BlogPost: React.FC<BlogPostProps> = ({ meta, children }) => {
  const { title, date, links } = meta;
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'b') return navigate('/blog');
      const hit = links?.find((l) => l.key[0].toLowerCase() === e.key.toLowerCase());
      if (hit) navigate(hit.to);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, links]);

  return (
    <div className="min-h-screen bg-tui-bg-dark">
      <Link
        to="/blog"
        className="fixed top-6 left-6 z-10 text-tui-dim hover:text-tui-text text-xs font-mono transition-colors"
      >
        ← <span className="text-tui-yellow">[b]</span>log
      </Link>

      <article className="max-w-[680px] mx-auto px-6 py-24 sm:py-32">
        {/*
          * With companion links the masthead is three lines tall, and a fixed 4rem
          * below it left the links stranded between a small gap above and a large
          * one below. They belong to the byline, so they sit closer to it, and the
          * break before the body shrinks to match.
          */}
        <header className={links?.length ? 'mb-12' : 'mb-16'}>
          <h1 className="font-serif text-tui-bright text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight mb-6">
            {title}
          </h1>
          <div className="font-serif text-tui-dim text-sm italic">
            By{' '}
            <Link to="/" className="text-tui-text hover:text-tui-bright transition-colors">
              Ryan Fahey
            </Link>{' '}
            <span className="text-tui-border not-italic mx-1">·</span>{' '}
            {new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>

          {/*
            * Companion pages, set as a menu of bracketed shortcuts — the same form
            * the corner link and every status bar on the site already use, and the
            * keys really work. Buttons looked like a web page pasted into a terminal.
            */}
          {links?.length ? (
            <div className="mt-3 font-mono text-xs leading-relaxed">
              {links.map(({ to, label, key }) => (
                <Link key={to} to={to} className="shortcut-link block w-fit no-underline">
                  <Shortcut label={label} token={key} />
                </Link>
              ))}
            </div>
          ) : null}
        </header>

        <div className="prose-reading">
          {children}
        </div>
      </article>
    </div>
  );
};

/**
 * `label` with the first occurrence of `token` wrapped in yellow brackets, so
 * "scan an id" with key "scan" renders as "[scan] an id".
 */
const Shortcut: React.FC<{ label: string; token: string }> = ({ label, token }) => {
  const i = label.toLowerCase().indexOf(token.toLowerCase());
  if (i < 0) return <>{label}</>;
  return (
    <>
      {label.slice(0, i)}
      <span className="text-tui-yellow">[{label.slice(i, i + token.length)}]</span>
      {label.slice(i + token.length)}
    </>
  );
};

export default BlogPost;
