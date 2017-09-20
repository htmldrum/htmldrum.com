import React from 'react'

class TalkLink extends React.Component {
  render() {
    const {talk} = this.props;
    return (
      <div className="pa4 bg-animate hover-bg-light-yellow">
        <a href={talk.url}>
          <div className="b gold f4 f2-ns">
            { talk.name}
          </div>
          <div className="mh2 purple mb2 f6 f4-ns">
            { talk.description }
          </div>
        </a>
      </div>
    );
  }
}

export default TalkLink
