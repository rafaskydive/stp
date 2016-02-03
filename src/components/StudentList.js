import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import moment from 'moment'
import twix from 'twix'
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
    let instructor = null
    try {
      instructor = Object.keys(student.jumps)
      .map(key=>{return student.jumps[key]})
      .find(jump=>{return jump.jump_date===jump_date})
      .instructor
    }
    catch (e) {
      console.log(`${student._id}: ${e}`)
    }
    return instructor ? ` with ${instructor}` : ""
  }

  toggleSort(attr) {
    this.props.toggleSort(attr)
  }

  currencyClass(daysSinceLastJump) {
    if(daysSinceLastJump > 30) { return "uncurrent" }
    if(daysSinceLastJump > 21) { return "red" }
    if(daysSinceLastJump > 14) { return "orange" }
    if(daysSinceLastJump > 7 ) { return "yellow" }
    return ""
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
            <div className="toolbar-actions text-center">
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
                <th onClick={() => this.toggleSort('name')}>
                  Name
                  <span className={nameSortClass}></span>
                </th>
                <th onClick={() => this.toggleSort('last_jump_date')}>
                  Last Jump
                  <span className={dateSortClass}></span>
                </th>
                <th>Currency</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {studentList.students.map(student => {
                let daysSinceLastJump = moment(student.last_jump_date).twix().count('days') - 1
                return (
                  <tr key={student._id} onClick={e => this.showStudent(student)}>
                    <td>{student.name}</td>
                    <td>
                      {moment(student.last_jump_date).format("ddd MMM Do")}
                      {this.lastJumpInstructor(student, student.last_jump_date)}
                      <span className={`currency-color ${this.currencyClass(daysSinceLastJump)}`}>{daysSinceLastJump} days</span>
                    </td>
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
