const path = require('path')
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators
  if (node.internal.type === `MarkdownRemark`) {
//    const slug = ("/blog" + createFilePath({ node, getNode, basePath: `posts` })).slice(0, -1);
    const slug = ("/blog" + createFilePath({ node, getNode, basePath: `posts` }))
    const dateMatch = node.id.match(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}/)
    if(dateMatch == null) {
      throw Error(`Unable to find a jekyll-compliant date in ${node.id}`)
    }
    const date = new Date(dateMatch[0])

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
    createNodeField({
      node,
      name: `date`,
      value: date,
    })

    if(typeof node.frontmatter.categories === 'undefined') {
      createNodeField({
        node,
        name: `categories`,
        value: []
      })
    } else {
      createNodeField({
        node,
        name: `categories`,
        value: node.frontmatter.categories.split(' ')
      })
    }
  }
}

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators
  return new Promise((resolve, reject) => {
    graphql(`
            {
              allMarkdownRemark {
                edges {
                  node {
                    fields {
                      slug
                    }
                  }
                }
              }
            }`
            ).then(result => {
              result.data.allMarkdownRemark.edges.map(({ node }) => {
                createPage({
                  path: node.fields.slug,
                  component: path.resolve(`./src/templates/post.js`),
                  context: { slug:  node.fields.slug }
                })
              })
              resolve()
            })
  })
}
