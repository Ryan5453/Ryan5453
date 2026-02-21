import React, { ReactNode, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TerminalWindow from './TerminalWindow';

interface BlogPostProps {
  title: string;
  date: string;
  children: ReactNode;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, date, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'b') navigate('/blog');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const slug = title.toLowerCase().replace(/\s+/g, '-');

  const statusBar = (
    <>
      <Link to="/blog" className="shortcut-link">
        <span className="text-tui-yellow">[b]</span>ack
      </Link>
      <span className="text-tui-dim truncate max-w-[60%] text-right">{title}</span>
    </>
  );

  return (
    <TerminalWindow title={`ryan@ryan.science: ~/blog/${slug}`} statusBar={statusBar}>
      <article>
        <h1 className="text-2xl font-bold text-tui-bright mb-3">
          {title}
        </h1>

        <div className="text-sm text-tui-dim mb-8 pb-8 border-b border-tui-border">
          {new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>

        <div className="prose max-w-none">
          {children}
        </div>
      </article>
    </TerminalWindow>
  );
};

export default BlogPost;
