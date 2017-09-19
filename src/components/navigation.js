import React from 'react'
import Link from "gatsby-link"
import './navigation.css';

export default ({ children }) =>
  <nav className="avenir w-20-ns pa3 pa4-ns">
    <Link className="link dim f6 f2-ns dib mr3 pt2-ns pl2-ns pr2-ns w-100-ns" to="/">Home</Link>
    <Link className="link dim f6 f2-ns dib mr3 pt2-ns pl2-ns pr2-ns w-100-ns" to="/blog">Blog</Link>
    <Link className="link dim f6 f2-ns dib mr3 pt2-ns pl2-ns pr2-ns w-100-ns" to="/open_source">Open Source</Link>
    <Link className="link dim f6 f2-ns dib mr3 pt2-ns pl2-ns pr2-ns w-100-ns" to="/talks">Talks</Link>
  </nav>