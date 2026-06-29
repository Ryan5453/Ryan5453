import React, { ReactNode, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface BlogPostProps {
  title: string;
  date: string;
  credits?: string;
  children: ReactNode;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, date, credits, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'b') navigate('/blog');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-tui-bg-dark">
      <Link
        to="/blog"
        className="fixed top-6 left-6 z-10 text-tui-dim hover:text-tui-text text-xs font-mono transition-colors"
      >
        ← <span className="text-tui-yellow">[b]</span>log
      </Link>

      <article className="max-w-[680px] mx-auto px-6 py-24 sm:py-32">
        <header className="mb-16">
          <h1 className="font-serif text-tui-bright text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight mb-6">
            {title}
          </h1>
          <div className="font-serif text-tui-dim text-sm italic">
            By{' '}
            <span className="relative inline-block">
              <Link
                to="/"
                className="peer text-tui-text hover:text-tui-bright transition-colors"
              >
                Ryan Fahey
              </Link>
              {credits && (
                <span className="pointer-events-none absolute left-0 bottom-full mb-2 px-2 py-1 bg-tui-bg-hl border border-tui-border text-tui-text text-xs not-italic font-mono whitespace-nowrap opacity-0 peer-hover:opacity-100 transition-opacity">
                  {credits}
                </span>
              )}
            </span>{' '}
            <span className="text-tui-border not-italic mx-1">·</span>{' '}
            {new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>

        <div className="prose-reading">
          {children}
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
