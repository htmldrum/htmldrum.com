import React from 'react'
import NavigationLink from "./navigation_link"
import './navigation.css';

class Navigation extends React.Component {
  render() {
    const sections = [
      {
        path: "/",
        title: "Home"
      },
      {
        path: "/blog",
        title: "Blog"
      },
      {
        path: "/open_source",
        title: "Open Source"
      },
      {
        path: "/talks",
        title: "Talks"
      }
    ];
    return(
      <nav className="avenir w-20-ns pa3 pa4-ns">
        { sections.map(s => <NavigationLink section={s} />) }
      </nav>
    )
  }
}

export default Navigation
