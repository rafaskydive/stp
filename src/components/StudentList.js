import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'

class StudentList extends Component {
  componentDidMount() {
    this.props.fetchStudents()
  }

  addStudent() {
    this.props.newStudent()
    window.location.hash='#/student/new/edit'
  }

  showStudent(student) {
    this.props.showStudent(student)
    this.props.push(`/student/${student._id}`)
  }

  render () {
    let { studentList, push } = {...this.props}
    return (
      <div className="pane-group">
        <div className="pane">
          <header className="sub-header">
            <div className="toolbar-actions">
              <div className="btn-group pull-right">
                <button className="btn btn-default" onClick={() => this.addStudent()}>
                  <span className="icon icon-user-add icon-text"></span>
                  Add
                </button>
              </div>
              <span className="page-title">Student List</span>
            </div>
          </header>
          <table className="table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {studentList.students.map(student => {
                return (
                  <tr key={student._id} onClick={e => this.showStudent(student)}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { studentList: state.studentList, student: state.student }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {
  push: routeActions.push
})

export default connect(mapStateToProps, mapDispatchToProps)(StudentList)
