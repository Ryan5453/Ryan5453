import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TerminalWindow from './components/TerminalWindow';

interface BlogPostMeta {
  url: string;
  title: string;
  date: string;
  description: string;
}

const Blog: React.FC = () => {
  const navigate = useNavigate();

  const blogPosts: BlogPostMeta[] = [
    {
      url: 'insecure-by-design',
      title: 'Insecure by Design',
      date: '2025-12-02',
      description: 'The AAMVA\'s driver\'s license barcode standard is insecure by design and generates an estimated $5-15M annually in \'solutions\'.',
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'h') navigate('/');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const statusBar = (
    <>
      <Link to="/" className="shortcut-link">
        <span className="text-tui-yellow">[h]</span>ome
      </Link>
      <span className="text-tui-dim">{blogPosts.length} post(s)</span>
    </>
  );

  return (
    <TerminalWindow title="ryan@ryan.science: ~/blog" statusBar={statusBar}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-tui-bright">Blog</h1>
        <p className="text-tui-dim mt-1 text-sm">just some things that interest me</p>
      </div>

      <div className="tui-panel">
        <span className="tui-panel-title">posts</span>
        {blogPosts.length === 0 ? (
          <p className="text-tui-dim">No posts yet. Check back soon!</p>
        ) : (
          <div className="space-y-1">
            {blogPosts.map((post) => (
              <Link
                key={post.url}
                to={`/blog/${post.url}`}
                className="project-item block"
              >
                <div className="flex items-start gap-3">
                  <span className="text-tui-yellow mt-0.5">▸</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-tui-bright font-bold">{post.title}</span>
                      <span className="text-tui-dim text-xs whitespace-nowrap">
                        {new Date(`${post.date}T12:00:00`).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-tui-dim mt-1 leading-relaxed">
                      {post.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </TerminalWindow>
  );
};

export default Blog;
