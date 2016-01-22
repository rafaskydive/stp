// const React = require('react');
import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import Classnames from 'classnames'

class App extends Component {

  handleNewStudentButtonClick(isNewStudent) {
    if (isNewStudent) { return {} }
    this.props.newStudent()
    window.location.hash='#/edit_student'
  }

  render () {
    const isNewStudent = this.props.student.new
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
                  onClick={() => this.props.push('/')}
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

function mapStateToProps(state) {
  return { student: state.student }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {
  push: routeActions.push
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
