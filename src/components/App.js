// const React = require('react');
import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import Classnames from 'classnames'

class App extends Component {
  render () {
    console.log('App props:', this.props)
    const homeButtonClass = Classnames({
      'btn btn-default': true,
      'active': this.props.location.pathname === '/'
    })
    return (
      <div className="window">
        <header className="toolbar toolbar-header">
          <div className="toolbar-actions">

            <div className="btn-group">
              <div className={homeButtonClass}>
                <span className="icon icon-home"
                  onClick={() => this.props.push('/')}
                ></span>
              </div>
            </div>

          </div>
        </header>
        <div className="window-content">
          {this.props.children}
        </div>
      </div>
    )
  }
};

function mapStateToProps(state) {
  return { student: state.student }
}

const mapDispatchToProps = {
  push: routeActions.push
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
