import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import moment from 'moment'
import twix from 'twix'
import Classnames from 'classnames'

export class StudentList extends Component {
  componentDidMount() {
    this.props.fetchStudents()
  }
  render() {
    return (
      <div className="pane">
        <Header {...this.props}/>
        <ListTable {...this.props}/>
      </div>
    )
  }
}

export const Header = props => (
  <header className="sub-header">
    <Toolbar {...props}/>
  </header>
)

export const Toolbar = props => (
  <div className="toolbar-actions">
    <NameFilterForm {...props}/>
    <AddStudentButton newStudent={props.newStudent} push={props.push}/>
    <SettingsButton push={props.push}/>
  </div>
)
export const NameFilterForm = ({filterByName, nameFilter}) => (
  <form>
    <input
      autoFocus={true}
      placeholder="Filter by Name"
      className="student-list-filter pull-left"
      onChange={e => filterByName(e.target.value)}
      value={nameFilter}
    />
  </form>
)

export const AddStudentButton = ({newStudent, push}) => (
  <button className="btn btn-default" onClick={() => { newStudent(); push('/student/new') } }>
    <span className="icon icon-user-add icon-text"></span>
    Add
  </button>
)

export const SettingsButton = ({push}) => (
  <button className="btn btn-default pull-right" onClick={() => push('/settings')}>
    <span className="icon icon-cog"></span>
  </button>
)

export const ListTable = props => (
  <table className="table-striped">
    <ListTableHead {...props}/>
    <ListTableBody {...props}/>
  </table>
)

export const ListTableHead = props => (
  <thead>
    <ListTableHeadRow {...props}/>
  </thead>
)

export const ListTableHeadRow = ({toggleSort, studentList}) => (
  <tr>
    <Th name="Name" onClick={e => toggleSort('name')} sortField="name" sortBy={studentList.sortBy} sortDesc={studentList.sortDesc}/>
    <Th name="Email"/>
    <Th name="Phone"/>
    <Th name="Last Jump" onClick={e => toggleSort('last_jump_date')} sortField="last_jump_date" sortBy={studentList.sortBy} sortDesc={studentList.sortDesc}/>
    <Th name="Last Jump Date"/>
  </tr>
)

export const Th = props => {
  let SortIndicator = props.sortField ? <span className={ColumnSortClass(props.sortField, props.sortBy, props.sortDesc)}></span> : ""

  return (
    <th onClick={props.onClick}>
      {props.name}
      {SortIndicator}
    </th>
  )
}

export const ListTableBody = ({studentList, showStudent, push}) => {
  const studentRows = renderStudentRows(studentList.filteredStudents, showStudent, push)
  return (
    <tbody>
      { studentRows }
    </tbody>
  )
}

export const renderStudentRows = (students, showStudent, push) => (
  students.map(student => renderStudentRow(student, showStudent, push))
)

export const renderStudentRow = (student, showStudent, push) => {
  let {_id, name, email, phone, last_jump_date} = {...student}
  let daysSinceLastJump = moment(last_jump_date).twix().count('days') - 1
  return (
    <tr key={_id} onClick={e => { showStudent(student); push(`/student/${student._id}`)}}>
      <td>{name}</td>
      <td>{email}</td>
      <td>{phone}</td>
      <td>
        {moment(last_jump_date).format("ddd MMM Do")}
        <span className={`currency-color ${currencyClass(daysSinceLastJump)}`}>{daysSinceLastJump} days</span>
      </td>
      <td>
        {lastJumpInfo(student, student.last_jump_date)}
      </td>
    </tr>
  )
}

export const ColumnSortClass = (column, sortBy, sortDesc) => {
  return Classnames({
    'icon pull-right': true,
    'icon-arrow-combo': sortBy !== column,
    'icon-down-dir': sortBy === column && sortDesc,
    'icon-up-dir': sortBy === column && !sortDesc
  })
}

export const currencyClass = daysSinceLastJump => {
  if(daysSinceLastJump > 30) { return "uncurrent" }
  if(daysSinceLastJump > 21) { return "red" }
  if(daysSinceLastJump > 14) { return "orange" }
  if(daysSinceLastJump > 7 ) { return "yellow" }
  return ""
}

export const lastJumpInfo = (student, last_jump_date) => {
  let jump = null
  try {
    jump = Object.keys(student.jumps)
    .map(key=>{return student.jumps[key]})
    .find(jump=>{return jump.jump_date===last_jump_date})
  }
  catch (e) {
    console.log(`${student._id}: ${e}`)
  }
  return jump ? ` DF${jump.dive_flow} ${jump.instructor.match(/\b\w/g).join('')}` : ""
}

function mapStateToProps(state) {
  return { studentList: state.studentList, student: state.student }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {
  push: routeActions.push
})

export default connect(mapStateToProps, mapDispatchToProps)(StudentList)
