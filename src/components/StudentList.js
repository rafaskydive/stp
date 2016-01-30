import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import moment from 'moment'
import Classnames from 'classnames'

class StudentList extends Component {
  componentDidMount() {
    this.props.fetchStudents()
  }

  addStudent() {
    this.props.newStudent()
    this.props.push(`/student/new`)
  }

  showStudent(student) {
    this.props.showStudent(student)
    this.props.push(`/student/${student._id}`)
  }

  lastJumpInstructor(student, jump_date) {
    let instructor = Object.keys(student.jumps)
    .map(key=>{return student.jumps[key]})
    .find(jump=>{return jump.jump_date===jump_date})
    .instructor
    console.log('instructor', instructor)
    return instructor ? ` with ${instructor}` : ""
  }

  toggleSort(attr) {
    this.props.toggleSort(attr)
  }
  
  render () {
    let nameSortClass = Classnames({
      'icon pull-right': true,
      'icon-arrow-combo': this.props.studentList.sortBy !== "name",
      'icon-down-dir': this.props.studentList.sortDesc === true && this.props.studentList.sortBy === "name",
      'icon-up-dir': this.props.studentList.sortDesc === false && this.props.studentList.sortBy === "name"
    })
    let dateSortClass = Classnames({
      'icon pull-right': true,
      'icon-arrow-combo': this.props.studentList.sortBy !== "last_jump_date",
      'icon-down-dir': this.props.studentList.sortDesc === true && this.props.studentList.sortBy === "last_jump_date",
      'icon-up-dir': this.props.studentList.sortDesc === false && this.props.studentList.sortBy === "last_jump_date"
    })
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
                <th>
                  Name
                  <span className={nameSortClass} onClick={() => this.toggleSort('name')}></span>
                </th>
                <th>
                  Last Jump
                  <span className={dateSortClass} onClick={() => this.toggleSort('last_jump_date')}></span>
                </th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {studentList.students.map(student => {
                return (
                  <tr key={student._id} onClick={e => this.showStudent(student)}>
                    <td>{student.name}</td>
                    <td>{moment(student.last_jump_date).format("MMM Do")}{this.lastJumpInstructor(student, student.last_jump_date)}</td>
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
