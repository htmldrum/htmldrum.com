import React from "react"
import Link from 'gatsby-link'
import BlogPostLink from '../components/blog_post_link';

export default ({ data }) => {
  return (
      <section className="w-100 pv3 f6 ph3 avenir purple">
        <div className="mw20 center">
          <div className="mw20 center ph3-ns">
            <div className="cf ph2-ns">
              <div className="fl w-100 w-50-ns pa2">
                <div className="pv4 pa2 f6 f4-ns">{ data.site.siteMetadata.blog.blurb }</div>
              </div>
              <div className="fl w-100 w-50-ns pa2">
                { data.allMarkdownRemark.edges.map(({node}) => <BlogPostLink node={node}/>) }
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}

export const query = graphql`
  query BlogQuery {
    site {
      siteMetadata {
        blog {
          blurb
        }
      }
    }
    allMarkdownRemark( sort: { fields: [fields___date], order: DESC}) {
      edges {
        node {
          id
          fields {
            slug
            date(formatString: "DD MMMM, YYYY")
            categories
          }
          frontmatter {
            title
            summary
          }
        }
      }
    }
  }`