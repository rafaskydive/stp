import React, { Component } from 'react'
import ErrorStatus from './ErrorStatus'
import InstructorInput from './InstructorInput'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import Classnames from 'classnames'
import moment from 'moment'

class Student extends Component {

  componentDidMount() {
    if (this.props.params.id === 'new') {
      return this.props.newStudent()
    }
    return this.props.fetchStudent(this.props.params.id)
  }

  render() {
    let { student } = {...this.props}
    let jumpsBtnClass = Classnames({
      'btn btn-default': true,
      'active': this.props.location.pathname === `/student/${student._id}`
    })
    let notesBtnClass = Classnames({
      'btn btn-default': true,
      'active': this.props.location.pathname === `/student/${student._id}/notes`
    })
    return (
      <div className="pane-group">
        <div className="pane">
          <header className="sub-header">
            <div className="toolbar-actions text-center">
              <div className="btn-group pull-left">
                <button className="btn btn-default" onClick={() => this.props.push('/')}>
                  <span className="icon icon-left-open icon-text"></span>
                  All Students
                </button>
              </div>
              <div className='btn-group pull-left'>
                <div className={jumpsBtnClass} onClick={e => {this.props.push(`/student/${student._id}`)}}>
                  <span className='icon icon-text icon-flight'></span>
                  Jumps
                </div>
                <div className={notesBtnClass} onClick={e => {this.props.push(`/student/${student._id}/notes`)}}>
                  <span className='icon icon-text icon-doc-text'></span>
                  Notes
                </div>
              </div>
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
  fetchStudent: actionCreators.fetchStudent,
  editStudentField: actionCreators.editStudentField,
  enableStudentEditForm: actionCreators.enableStudentEditForm,
  disableStudentEditForm: actionCreators.disableStudentEditForm,
  saveStudent: actionCreators.saveStudent
})

export default connect(mapStateToProps, mapDispatchToProps)(Student)
