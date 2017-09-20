import React from "react"
import Link from 'gatsby-link'
import TalkLink from '../components/talk_link';

export default ({ data }) => {
  return (
      <section className="w-100 pv3 f6 ph3 avenir purple">
        <div className="mw20 center">
          <div className="mw20 center ph3-ns">
            <div className="cf ph2-ns">
              <div className="fl w-100 w-50-ns pa2">
                <div className="pv4 pa2 f6 f4-ns">{ data.site.siteMetadata.talks.blurb }</div>
              </div>
              <div className="fl w-100 w-50-ns pa2">
                { data.site.siteMetadata.talks.presentations.map( talk => <TalkLink talk={talk}/>) }
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}

export const query = graphql`
  query TalksQuery {
    site {
      siteMetadata {
        talks {
          blurb
          presentations {
            name
            date
            description
            url
          }
        }
      }
    }
  }`