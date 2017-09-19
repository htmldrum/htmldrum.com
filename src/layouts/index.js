require("tachyons");
import './index.css';

import React from "react"
import Link from "gatsby-link"
import Navigation from "../components/navigation.js";

export default ({ children, data }) =>
  <div>
    <div className="flex flex-column min-vh-100-ns flex-row-ns">
    <Navigation />
    {children()}
    </div>
  </div>

export const query = graphql`
query LayoutQuery {
  site {
    siteMetadata {
      title
    }
  }
}
`