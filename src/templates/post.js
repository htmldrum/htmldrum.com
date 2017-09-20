import React from "react"

export default ({ data }) => {
  const post = data.markdownRemark
  return (
      <b>{ post.fields.slug }</b>
  )
}

export const query = graphql`
query BlogPostQuery {
  markdownRemark {
    html
    frontmatter {
      title
    }
    fields {
      slug
    }
  }
}`
