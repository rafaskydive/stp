import React, { Component } from 'react'
import ErrorStatus from './ErrorStatus'
import InstructorInput from './InstructorInput'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
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
    return (
      <div className="window">
        <Header {...this.props}/>
        {this.props.children}
        <Footer {...this.props}/>
      </div>
    )
  }
}

export const Header = props => (
  <header className="toolbar toolbar-header">
    <Toolbar {...props}/>
  </header>
)

export const Toolbar = ({student, location, push}) => (
  <div className="toolbar-actions text-center">
    <button className="btn btn-default pull-left"
      onClick={() => {
        push(location.pathname.match(/\/jump\//) ? `/student/${student._id}` : "/")
      }}>
      <span className="icon icon-left-open"></span>
    </button>
    <span className="page-title">{student.name || "New Student"}</span>
  </div>
)

export const Footer = ({student}) => (
  <footer className="toolbar toolbar-footer">
    <ErrorStatus errors={student.errors}/>
  </footer>
)

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
