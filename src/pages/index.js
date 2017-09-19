import React from "react"

export const query = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }`

export default ({ data }) =>
  <section className="container avenir flex flex-auto flex-column flex-row-ns justify-center">
    <div className="fl w-25 pa2"></div>
    <div className="fl tc w-50-ns pa2 justify-center">
      <div className="b purple f4 f2-ns pa2">👋 Hi, I'm James</div>
      <div className="content-center pa4-ns br-100-ns bg-gold mw0 center mt4-ns mv2-ns mb6-ns">
        <img className="pa5-ns" src="/static/home.jpg" />
      </div>
      <div className="f6 f4-ns purple pa2-ns ma4 overflow-y-auto">
           I'm a Sydney-based Software Engineer.<br />
           I work with innovative companies to match maintainable software solutions with fuzzy requirements.<br />
           I started programming last century, working with HTML and CSS in Notepad.exe. Before too long I moved on to ActionScript 2.0 in Adobe Flash Professional 😎
           <br />
           <br />
           After university I administered corporate IT systems for a few years. Then, I moved to the USA where I
           I built and maintained Content Management systems for Art Galleries and Publishers. Since coming back to Australia,
           I've built and maintained high traffic web services in the Gig Economy and designed and implemented secure infrastructure for
           CitiBank AusPac.<br />
           <br />
           Outside of work I attend and host meet ups and blog on technology.
           I enjoy recreationally programming in Go and Rust, within Emacs.
           In my spare time I enjoy horticulture and electronics.<br />
           <br />
           I'm currently looking for job opportunities outside the Sydney area. Either remote or on-site.<br />
           If you'd like to get in contact with potential opportunities I can be reached on twitter twitter_handle<br />
           You can find my CV <nuxt-link to="~assets/cv.pdf">here</nuxt-link>.
      </div>
    </div>
    <div className="fl w-25 pa2"></div>
  </section>