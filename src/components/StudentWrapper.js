import React, { Component } from 'react'
import ErrorStatus from './ErrorStatus'
import InstructorInput from './InstructorInput'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import Classnames from 'classnames'
import moment from 'moment'

class StudentWrapper extends Component {

  componentDidMount() {
    if (this.props.params.id === 'new') {
      return this.props.newStudent()
    }
    return this.props.fetchStudent(this.props.params.id)
  }

  render() {
    let { student } = {...this.props}
    let backButton = this.props.location.pathname.match(/\/jump\//) ? `/student/${student._id}` : "/"
    return (
      <div className="pane-group">
        <div className="pane">
          <header className="sub-header">
            <div className="toolbar-actions text-center">
              <button className="btn btn-default pull-left" onClick={() => this.props.push(backButton)}>
                <span className="icon icon-left-open"></span>
              </button>
              <span className="page-title">{student.name || "New Student"}</span>
              <ErrorStatus errors={student.errors}/>
            </div>
          </header>
          {this.props.children}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { student: state.student }
}

const mapDispatchToProps = Object.assign({}, {
  push: routeActions.push,
  newStudent: actionCreators.newStudent,
  fetchStudent: actionCreators.fetchStudent,
  editStudentField: actionCreators.editStudentField,
  enableStudentEditForm: actionCreators.enableStudentEditForm,
  disableStudentEditForm: actionCreators.disableStudentEditForm,
  saveStudent: actionCreators.saveStudent
})

export default connect(mapStateToProps, mapDispatchToProps)(StudentWrapper)
