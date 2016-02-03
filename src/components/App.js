// const React = require('react');
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import Classnames from 'classnames'

class App extends Component {
  render () {
    // const homeButtonClass = Classnames({
    //   'btn btn-default': true,
    //   'active': this.props.location.pathname === '/'
    // })
    return (
      <div className="window">
        {/*
        <header className="toolbar toolbar-header">
          <div className="toolbar-actions">

            <div className="btn-group">
              <div className={homeButtonClass} onClick={() => this.props.push('/')}>
                <span className="icon icon-home"></span>
              </div>
            </div>

          </div>
        </header>
        */}
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
