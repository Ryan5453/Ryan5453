import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Portfolio from './Portfolio'
import Blog from './Blog'
import Music from './Music'
import NotFound from './NotFound'

// Only one post links here, and it pulls in a barcode decoder and a credential
// stack. Split it out so everyone else never downloads it.
const Verify = lazy(() => import('./Verify'))
const Vendors = lazy(() => import('./Vendors'))
const Recover = lazy(() => import('./Recover'))
import { posts } from './posts'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/lastfm" element={<Music />} />
        <Route
          path="/blog/keys-not-included/vendors"
          element={
            <Suspense fallback={null}>
              <Vendors />
            </Suspense>
          }
        />
        <Route
          path="/blog/keys-not-included/verify"
          element={
            <Suspense fallback={null}>
              <Verify />
            </Suspense>
          }
        />
        <Route
          path="/blog/keys-not-included/recover"
          element={
            <Suspense fallback={null}>
              <Recover />
            </Suspense>
          }
        />
        {posts.map(({ meta, Component }) => (
          <Route key={meta.slug} path={`/blog/${meta.slug}`} element={<Component />} />
        ))}
        {/* Must stay last: this is the fallthrough for anything unmatched. */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
