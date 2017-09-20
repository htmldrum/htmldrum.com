import React from 'react'
import Link from "gatsby-link"
import PropTypes from 'prop-types';

class NavigationLink extends React.Component {
  render() {
    const { section } = this.props
    const isActive = (this.context.router.route.location.pathname == section.path)
    if(isActive) {
      var className = "link dim f6 f2-ns dib mr3 pt2-ns pl2-ns pr2-ns w-100-ns b"      
    } else {
      var className = "link dim f6 f2-ns dib mr3 pt2-ns pl2-ns pr2-ns w-100-ns"
    }
    return(
        <Link className={className} to={section.path}>{section.title}</Link>
    )
  }
}

NavigationLink.contextTypes = {
  router: PropTypes.object
};

export default NavigationLink