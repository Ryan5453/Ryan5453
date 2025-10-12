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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-50 dark:from-blue-950 dark:via-sky-950 dark:to-blue-950">
      {/* Background decorative elements (no animation) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-sky-200 dark:bg-sky-900 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-200 dark:bg-indigo-900 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative container max-w-2xl mx-auto px-6 py-16">
        {/* Blog Post Content */}
        <article className="relative bg-white/80 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-blue-100/50 dark:border-blue-900/50 shadow-xl shadow-blue-100/50 dark:shadow-blue-950/50 hover:shadow-2xl hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50 transition-all duration-500">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-950 dark:hover:text-blue-100 transition-all mb-6 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Blog</span>
          </Link>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-950 dark:text-blue-50 mb-4">
            {title}
          </h1>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 mb-8 pb-8 border-b border-blue-200 dark:border-blue-800">
            <Calendar size={16} />
            <time dateTime={date}>
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>

          {/* Custom Content */}
          <div className="prose prose-blue dark:prose-invert max-w-none">
            {children}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;

