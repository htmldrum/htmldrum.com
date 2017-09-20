import React from "react"
import Link from 'gatsby-link'
import OpenSourceLink from '../components/open_source_link';

export default ({ data }) => {
  return (
      <section className="w-100 pv3 f6 ph3 avenir purple">
        <div className="mw20 center">
          <div className="mw20 center ph3-ns">
            <div className="cf ph2-ns">
              <div className="fl w-100 w-50-ns pa2">
                <div className="pv4 pa2 f6 f4-ns">{ data.site.siteMetadata.open_source.blurb }</div>
              </div>
              <div className="fl w-100 w-50-ns pa2">
                { data.site.siteMetadata.open_source.projects.map(project => <OpenSourceLink project={project}/>) }
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}

export const query = graphql`
  query OpenSourceQuery {
    site {
      siteMetadata {
        open_source {
          blurb
          github {
            handle
          }
          projects {
            name
            description
            url
          }
        }
      }
    }
  }`