import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';

interface BlogPostMeta {
  url: string;
  title: string;
  date: string;
  description: string;
}

const Blog: React.FC = () => {
  const blogPosts: BlogPostMeta[] = [
    {
      url: 'insecure-by-design',
      title: 'Insecure by Design',
      date: '2025-12-02',
      description: 'The AAMVA\'s driver\'s license barcode standard is insecure by design and generates an estimated $5-15M annually in \'solutions\'.',
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f4' }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 hover:opacity-60 transition-opacity mb-6"
            style={{ color: '#57534e' }}
          >
            <ArrowLeft size={18} />
            <span>Home</span>
          </Link>

          <h1 className="text-2xl font-bold" style={{ color: '#1c1917' }}>
            Blog
          </h1>
          <p className="mt-2" style={{ color: '#57534e' }}>
            Just some things that interest me.
          </p>
        </header>

        {/* Posts */}
        <section>
          {blogPosts.length === 0 ? (
            <div className="border rounded-lg p-6" style={{ borderColor: '#e7e5e4', backgroundColor: '#ffffff' }}>
              <p style={{ color: '#57534e' }}>No posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <Link
                  key={post.url}
                  to={`/blog/${post.url}`}
                  className="block group"
                >
                  <div className="border rounded-lg p-5 hover:border-stone-400 transition-colors" style={{ borderColor: '#e7e5e4', backgroundColor: '#ffffff' }}>
                    <h2 className="font-bold mb-1" style={{ color: '#1c1917' }}>
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm mb-3" style={{ color: '#78716c' }}>
                      <Calendar size={14} />
                      <time dateTime={post.date}>
                        {new Date(`${post.date}T12:00:00`).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#57534e' }}>
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Blog;
