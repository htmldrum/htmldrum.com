import React from "react"
import g from "glamorous"
import Link from 'gatsby-link'

import { rhythm } from "../utils/typography"

export default ({ data }) => {
  console.log(data)
  return (
    <div>
      <g.H1 display={"inline-block"} borderBottom={"1px solid"}>
        Amazing Pandas Eating Things
      </g.H1>
      <h4>
      {data.allMarkdownRemark.totalCount} Posts
    </h4>
      {data.allMarkdownRemark.edges.map(({ node }) =>
                                        <div>
                                        <Link
                                          to={node.fields.id}
                                          css={{ textDecoration: `none`, color: `inherit`}}
                                        >

                                        <g.H3 marginBottom={rhythm(1 / 4)}>
                                        {node.frontmatter.title}{" "}
                                        <g.Span color="#BBB">— {node.frontmatter.date}</g.Span>
                                        </g.H3>
                                        <p>
                                        {node.excerpt}
                                        </p>
                                        </Link>
                                        </div>
                                       )}
    </div>
  )
}

export const query = graphql`
query IndexQuery {
  allMarkdownRemark {
    totalCount
    edges {
      node {
        frontmatter {
          title
        }
        fields {
          slug,
          id
        }
        excerpt
      }
    }
  }
}`

/*
import React from 'react'
import Link from 'gatsby-link'

const IndexPage = () => (
  <div>
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <Link to="/page-2/">Go to page 2</Link>
  </div>
)

export default IndexPage
*/