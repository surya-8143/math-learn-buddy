import React, { Component } from 'react';

class AboutClassPage extends Component {
  render() {
    return (
      <div className="App">
        <h1>About Road Safety</h1>

        <p style={{ maxWidth: '700px', fontSize: '1.1rem' }}>
          This page is implemented using a React <b>Class Component</b>.
          It explains the importance of traffic signals and road safety rules
          for children in a simple and friendly way.
        </p>

        <p>
          Red means Stop, Yellow means Wait, and Green means Go.
          Road signs help us stay safe on the roads.
        </p>

        <button
          className="mode-switch"
          onClick={this.props.goBack}
        >
          ⬅ Back
        </button>
      </div>
    );
  }
}

export default AboutClassPage;
