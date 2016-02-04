// const React = require('react');
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import Classnames from 'classnames'

class App extends Component {
  render () {
    return (
      <div className="window">
        <div className="window-content">
          {this.props.children}
        </div>
      </div>
    )
  }
};

function mapStateToProps(state) {
  return { student: state.student, studentList: state.studentList }
}

const mapDispatchToProps = {
  push: routeActions.push
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
