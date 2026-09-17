import type { Plugin } from 'vite';
import { createServer } from 'vite';

/**
 * The four fields a feed needs. Deliberately declared here rather than imported from
 * the app's PostMeta: that type lives in a .tsx file typed against the DOM, and dragging
 * it into the Node build would drag the browser globals with it. If a post ever stops
 * carrying one of these, the load below fails loudly at build time.
 */
interface FeedPost {
  slug: string;
  title: string;
  date: string;
  description: string;
}

const SITE = 'https://ryan.science';
const TITLE = 'Ryan Fahey';
const SUBTITLE = 'My personal website, portfolio, and blog.';
const AUTHOR = 'Ryan Fahey';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Post dates are plain YYYY-MM-DD. Pin them to UTC so no timezone can move a post a day. */
const at = (date: string) => new Date(`${date}T00:00:00Z`);

const rss = (posts: FeedPost[], built: Date) => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(TITLE)}</title>
    <link>${SITE}/blog</link>
    <description>${escape(SUBTITLE)}</description>
    <language>en</language>
    <lastBuildDate>${built.toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
${posts
  .map(
    (p) => `    <item>
      <title>${escape(p.title)}</title>
      <link>${SITE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${p.slug}</guid>
      <pubDate>${at(p.date).toUTCString()}</pubDate>
      <description>${escape(p.description)}</description>
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>
`;

const atom = (posts: FeedPost[], built: Date) => `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escape(TITLE)}</title>
  <subtitle>${escape(SUBTITLE)}</subtitle>
  <id>${SITE}/</id>
  <link href="${SITE}/blog" rel="alternate" type="text/html" />
  <link href="${SITE}/atom.xml" rel="self" type="application/atom+xml" />
  <updated>${built.toISOString()}</updated>
  <author><name>${escape(AUTHOR)}</name></author>
${posts
  .map(
    (p) => `  <entry>
    <title>${escape(p.title)}</title>
    <id>${SITE}/blog/${p.slug}</id>
    <link href="${SITE}/blog/${p.slug}" rel="alternate" type="text/html" />
    <published>${at(p.date).toISOString()}</published>
    <updated>${at(p.date).toISOString()}</updated>
    <summary>${escape(p.description)}</summary>
  </entry>`,
  )
  .join('\n')}
</feed>
`;

/**
 * Writes /rss.xml and /atom.xml at build time.
 *
 * The site is a single-page app, but a feed does not need the app to run: every post
 * already declares its own title, date, slug and description, and src/posts/index.ts
 * collects them newest-first. This loads that one module in Node and writes the result
 * into the bundle, so the feed cannot list a post the site does not have, and there is
 * nothing to regenerate by hand.
 *
 * `apply: 'build'` matters twice over: it keeps the work out of the dev server, and it
 * stops the throwaway server below from loading this plugin and recursing.
 */
export function feed(): Plugin {
  return {
    name: 'feed',
    apply: 'build',
    async generateBundle() {
      const server = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
        logLevel: 'error',
      });
      try {
        const mod = (await server.ssrLoadModule('/src/posts/index.ts')) as {
          posts: { meta: FeedPost }[];
        };
        const posts = mod.posts.map((p) => p.meta);
        const built = new Date();
        this.emitFile({ type: 'asset', fileName: 'rss.xml', source: rss(posts, built) });
        this.emitFile({ type: 'asset', fileName: 'atom.xml', source: atom(posts, built) });
      } finally {
        await server.close();
      }
    },
  };
}
