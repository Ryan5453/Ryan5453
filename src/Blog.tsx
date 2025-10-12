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
    //{
  //    url: 'insecure-by-design',
   //   title: 'Insecure by Design',
   //   date: '2025-10-12',
   //   description: 'The AAMVA\'s driver\'s license barcode standard is insecure by design and generates ~$10M annually in \'solutions\'.',
 //   },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-50 dark:from-blue-950 dark:via-sky-950 dark:to-blue-950">
      {/* Background decorative elements (no animation) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-sky-200 dark:bg-sky-900 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-200 dark:bg-indigo-900 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative container max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="relative bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-blue-100/50 dark:border-blue-900/50 shadow-xl shadow-blue-100/50 dark:shadow-blue-950/50 hover:shadow-2xl hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50 transition-all duration-500">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-950 dark:hover:text-blue-100 transition-all mb-6 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Home</span>
          </Link>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-950 dark:text-blue-50">
            Ryan's Blog
          </h1>
          <p className="mt-4 text-lg text-blue-900 dark:text-blue-100 leading-relaxed">
            My thoughts and ideas on things that interest me.
          </p>
        </div>

        {/* Blog Posts */}
        <div className="relative mt-12">
          {blogPosts.length === 0 ? (
            <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-blue-100/50 dark:border-blue-900/50 shadow-xl shadow-blue-100/50 dark:shadow-blue-950/50 text-center">
              <p className="text-lg text-blue-900 dark:text-blue-100">
                No blog posts yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {blogPosts.map((post) => (
                <Link
                  key={post.url}
                  to={`/blog/${post.url}`}
                  className="group block bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-blue-100/50 dark:border-blue-900/50 shadow-xl shadow-blue-100/50 dark:shadow-blue-950/50 hover:shadow-2xl hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50 transition-all duration-500 hover:-translate-y-1"
                >
                  <h2 className="text-2xl font-bold text-blue-950 dark:text-blue-50 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 text-sm text-blue-700 dark:text-blue-300">
                    <Calendar size={16} />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  <p className="mt-4 text-blue-800 dark:text-blue-200 leading-relaxed">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;

