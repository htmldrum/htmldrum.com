module.exports = {
  siteMetadata: {
    title: "This is pretty cool actually",
    blog: {
      blurb: "Here are posts I've been maintaing since ~2010. Dragged from Blogger to Jekyll to Wordpress to Hugo and now my own format.",
    },
    talks: {
      blurb: "Community is a huge part of the work I do. Surrounding yourself with a group of people to learn from and share with leads to better outcomes than focusing too hard on your own abilities. I was an organizer of the <a href='https://meetup.com/nylug'>New York Linux User Group</a> from 2012 until 2015. Since taking a back seat from organizing workshops and facilitating events, I've spoken at a few Meet Ups in Sydney.",
      presentations: [
        {
          name: 'Fastlane',
          date: '08/09/2017',
          description: 'Talk given at Ruby on Rails Sydney August 2017 on using Fastlane (a Ruby tool) to manage iOS projects',
          url: '/static/presentations/fastlane/index.html'
        },
        {
          name: 'Prometheus',
          date: '15/03/2017',
          description: 'Talk given at Ruby on Rails Sydney March 2017 on using Prometheus with Rails',
          url: '/static/presentations/prometheus/index.html'
        },
        {
          name: 'Developing with Docker',
          date: '25/11/2016',
          description: 'A speech given at workpacle to introduce developers to containers and virtualization with Docker',
          url: '/static/presentations/developing_with_docker/index.html'
        },
        {
          name: 'Terminal Workflows',
          date: '25/03/2013',
          description: 'Less a presentation, more of a workshop. Given at NYPL on Christopher Street. In the future, I\'d like to revisit these ideas.',
          url: 'https://htmldrum.github.io/TerminalWorkflows'
        },
        {
          name: 'Redmine',
          date: '15/01/2013',
          description: 'I used to *love* Redmine. Or maybe I just hated using Jira.',
          url: '/static/presentations/project_management_with_redmine/index.html'
        }
      ]
    },
    open_source: {
      github: {
        handle: 'htmldrum'
      },
      blurb: 'Here\'s a list of some open source projects I maintain. I\'d love to do more work in the open but commercial constraints mean that I generally do not.',
      projects: [
        // {
        //   name: 'net-runner'
        //   description: 'A scalable browser-based test execution framework. Designed for running tests in thousands of sites concurrently'
        // },
        // {
        //   name: 'zc-conf',
        //   description: 'A tool for generating zero-conf networking configurations that can be linked against hardware implementations
        // },
        // {
        //   name: 'bd',
        //   description: 'BlueDream (bd) is a command-line tool for converting analogues data structures between languages and performing command line highlighting for source text'
        // },
        {
          name: 'generic_controller',
          description: 'An opinionated generic resource-oriented controller for rails',
          url: 'https://rubygems.org/gems/generic_controller'
        },
        {
          name: 'htmldrum.com',
          description: 'The source for this blog',
          url: 'https://github.com/htmldrum/htmldrum.com'
        },
        {
          name: 'abcd',
          description: 'Programatically interact with services provided by the Australian Broadcasting Commission',
          url: 'https://github.com/htmldrum/abcd'
        }
      ]
    }
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      }
    },
    `gatsby-plugin-glamor`,
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              // Class prefix for <pre> tags containing syntax highlighting;
              // defaults to 'language-' (eg <pre class="language-js">).
              // If your site loads Prism into the browser at runtime,
              // (eg for use with libraries like react-live),
              // you may use this to prevent Prism from re-processing syntax.
              // This is an uncommon use-case though;
              // If you're unsure, it's best to use the default value.
              classPrefix: 'language-',
            },
          },
        ]
      }
    }
  ],
}