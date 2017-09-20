import './post.css';
import React from "react"

export default ({ data }) => {
  const post = data.markdownRemark
  return (
      <div className="avenir pa2 pa4-ns postContainer">
        <h1>
          {post.frontmatter.title}
        </h1>
        <div className="mh2" dangerouslySetInnerHTML={{ __html: post.html }} />
     </div>
  )
}

export const query = graphql`
query MyQueryName($slug: String!) {
  markdownRemark(fields: { slug: { eq: $slug } }) {
    html
    frontmatter {
      title
    }
    fields {
     slug
    }
  }
}
`

