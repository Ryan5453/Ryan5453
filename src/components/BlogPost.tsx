import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';

interface BlogPostProps {
  title: string;
  date: string;
  children: ReactNode;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, date, children }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f4' }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <article>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 hover:opacity-60 transition-opacity mb-8"
            style={{ color: '#57534e' }}
          >
            <ArrowLeft size={18} />
            <span>Back to Blog</span>
          </Link>

          <h1 className="text-2xl font-bold mb-3" style={{ color: '#1c1917' }}>
            {title}
          </h1>

          <div className="flex items-center gap-2 text-sm mb-8 pb-8" style={{ color: '#78716c', borderBottom: '1px solid #e7e5e4' }}>
            <Calendar size={14} />
            <time dateTime={date}>
              {new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>

          <div className="prose max-w-none" style={{ color: '#1c1917' }}>
            {children}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
