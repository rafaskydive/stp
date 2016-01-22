// const React = require('react');
import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import Classnames from 'classnames'

class App extends Component {

  handleNewStudentButtonClick(isNewStudent) {
    return (
      isNewStudent ?
      {} :
      this.props.dispatch(routeActions.push('/edit_student?new=true'))
    )
  }

  render () {
    const isNewStudent = this.props.location.query.new
    const newStudentButtonClass = Classnames({
      'btn btn-default': true,
      'active': isNewStudent
    })
    return (
      <div className="window">
        <header className="toolbar toolbar-header">
          <div className="toolbar-actions">

            <div className="btn-group">
              <div className="btn btn-default">
                <span className="icon icon-home"
                  onClick={() => this.props.dispatch(routeActions.push('/'))}
                ></span>
              </div>
            </div>

            <div className="btn-group">
              <div className={newStudentButtonClass}
                onClick={() => this.handleNewStudentButtonClick(isNewStudent)}>
                <span className="icon icon-user icon-text"></span>
                New Student
              </div>
            </div>

          </div>
        </header>
        <div className="window-content">
          <div className="pane padded">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
};

function select(state) {
  return {state: state}
}

export default connect(select)(App)
