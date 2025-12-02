import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Portfolio from './Portfolio'
import Blog from './Blog'
import InsecureByDesign from './components/InsecureByDesign'
import Resume from './Resume'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/insecure-by-design" element={<InsecureByDesign />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
