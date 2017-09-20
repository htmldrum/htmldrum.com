import React from 'react'
import Link from 'gatsby-link'

class BlogPostLink extends React.Component {
  render() {
    const {node} = this.props
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    console.log('date', node.fields);
    return (
      <div className="pa4 bg-animate hover-bg-light-yellow">
        <Link to={node.fields.slug}>
          <div className="b gold f4 f2-ns">
            { node.frontmatter.title }
          </div>
          <div className="mh2 purple mb2 f6 f4-ns">
            { node.frontmatter.summary }
          </div>
          <div className="tr gray f6 mt2 f6-ns">
            { new Date(node.fields.date).toLocaleDateString('en-us', options) }
          </div>
          <p className="tr gray">{ node.fields.categories.join(', ') }</p>
      </Link>
    </div>
    );
  }
}

export default BlogPostLink
