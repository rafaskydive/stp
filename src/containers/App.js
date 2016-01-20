import React, { Component } from 'react';
import { connect } from 'react-redux';

export default class App extends Component {

  render() {
    return (
      <div>
        <h1>App</h1>
      </div>
    )
  }
}

function select(state) {
  return state;
}

export default connect(select)(App);
