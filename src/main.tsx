import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Portfolio from './Portfolio'
import Blog from './Blog'
import Music from './Music'
import InsecureByDesign from './components/InsecureByDesign'
import DoYouKYC from './components/DoYouKYC'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/lastfm" element={<Music />} />
        <Route path="/blog/insecure-by-design" element={<InsecureByDesign />} />
        <Route path="/blog/do-you-know-your-citizen" element={<DoYouKYC />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
