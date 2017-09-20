import React from 'react'
import Link from 'gatsby-link'

class OpenSourceLink extends React.Component {
  render() {
    const {project} = this.props;
    const hasUrl = typeof(project.url) !== 'undefined';

    if(hasUrl) {
      return (
          <div className="pa4 bg-animate hover-bg-light-yellow">
          <a href={project.url}>
          <div className="b gold f4 f2-ns">
          { project.name}
        </div>
          <div className="mh2 purple mb2 f6 f4-ns">
          { project.description }
        </div>
          </a>
                        </div>
                      );
          }

        return (
            <div className="pa4 bg-animate hover-bg-light-yellow">
            <div className="b gold f4 f2-ns">
            { project.name}
          </div>
            <div className="mh2 purple mb2 f6 f4-ns">
            { project.description }
          </div>
          </div>
        );
      }
    }

    export default OpenSourceLink
