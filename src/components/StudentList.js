import React, { Component } from 'react'
import LoadingThing from './LoadingThing'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import * as actionCreators from '../actions'
import moment from 'moment'
import twix from 'twix'
import Classnames from 'classnames'

export class StudentList extends Component {
  componentDidMount() {
    this.props.fetchStudents()
  }
  render() {
    let WindowContent = this.props.studentList.loading ? LoadingThing : ListWindowContent
    return (
      <div className="window">
        <Header {...this.props}/>
        <WindowContent {...this.props}/>
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

export const Toolbar = props => (
  <div className="toolbar-actions">
    <NameFilterForm {...props}/>
    <AddStudentButton newStudent={props.newStudent} push={props.push}/>
    <AuthenticatedButtons {...props}/>
  </div>
)

const AuthenticatedButtons = props => (
  <div className="btn-group pull-right">
    <SettingsButton push={props.push}/>
    <ReportButton push={props.push}/>
    <AuthInfo auth={props.auth} push={props.push} logout={props.logout}/>
  </div>
)

const AuthInfo = ({auth, push, logout}) => {
  if (auth.loggedIn) {
    return (
      <button className="btn btn-default" onClick={() => logout()}>
        <span className="icon icon-logout icon-text"></span>
        Log Out {auth.loggedIn}
      </button>
    )
  }
  return (
    <button className="btn btn-default" onClick={() => push('/login')}>
      <span className="icon icon-login icon-text"></span>
      Log In
    </button>
  )
}

export const SettingsButton = ({push}) => (
  <button className="btn btn-default" onClick={() => push('/settings')}>
    <span className="icon icon-cog icon-text"></span>
    Settings
  </button>
)

export const ReportButton = ({push}) => (
  <button className="btn btn-default" onClick={() => push('/report')}>
    <span className="icon icon-newspaper icon-text"></span>
    Report
  </button>
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

export const ListTable = props => (
  <table className="table-striped">
    <ListTableHead {...props}/>
    <ListTableBody {...props}/>
  </table>
)

export const ListWindowContent = props => (
  <div className="window-content">
    <PaneGroup {...props}/>
  </div>
)

export const PaneGroup = props => (
  <div className="pane-group">
    <Pane {...props}/>
  </div>
)

export const Pane = props => (
  <div className="pane">
    <ListTable {...props}/>
  </div>
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
    <Th name="Last Jump Date" onClick={e => toggleSort('last_jump_date')} sortField="last_jump_date" sortBy={studentList.sortBy} sortDesc={studentList.sortDesc}/>
    <Th name="Last Dive Flow"/>
    <Th name="Next Visit Date" onClick={e => toggleSort('next_visit_date')} sortField="next_visit_date" sortBy={studentList.sortBy} sortDesc={studentList.sortDesc}/>
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
    <tr key={_id} onClick={e => { showStudent(student); push(`/student/${student._id}?tab=jumps`)}}>
      <td>{name}</td>
      <td>{email}</td>
      <td>{phone}</td>
      <td>
        {moment(last_jump_date).format("ddd MMM Do")}
        <span className="currency-color"  style={{backgroundColor: `${currencyColor(daysSinceLastJump)}`}}></span>
        <span className="currency">{daysSinceLastJump} days</span>
      </td>
      <td>
        {lastJumpInfo(student, student.last_jump_date)}
      </td>
      <td>
        {nextVisitDate(student.next_visit_date)}
      </td>
    </tr>
  )
}

export const Footer = props => (
  <footer className="toolbar toolbar-footer">
    <h1 className="title">Footer</h1>
  </footer>
)

export const ColumnSortClass = (column, sortBy, sortDesc) => {
  return Classnames({
    'icon pull-right': true,
    'icon-arrow-combo': sortBy !== column,
    'icon-down-dir': sortBy === column && sortDesc,
    'icon-up-dir': sortBy === column && !sortDesc
  })
}

const currencyColor = daysSinceLastJump => {
  if (daysSinceLastJump > 30) { return `rgb(255, 0, 0)` }
  if (daysSinceLastJump > 21) { return `rgb(255, ${192-Math.floor((64/7)*(daysSinceLastJump-21))}, 0)` }
  if (daysSinceLastJump > 14) { return `rgb(255, ${255-Math.floor((64/7)*(daysSinceLastJump-14))}, 0)` }
                                return `rgb(${Math.floor(255/14*daysSinceLastJump)}, 255, 0)`
}

// export const currencyClass = daysSinceLastJump => {
//   if(daysSinceLastJump > 30) { return "uncurrent" }
//   if(daysSinceLastJump > 21) { return "red" }
//   if(daysSinceLastJump > 14) { return "orange" }
//   if(daysSinceLastJump > 7 ) { return "yellow" }
//   return ""
// }

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

const nextVisitDate = (next_visit_date) => {
  return !next_visit_date ? <span></span> : <span>{moment(next_visit_date).format('ddd MMM Do')}</span>
}

function mapStateToProps(state) {
  return { studentList: state.studentList, student: state.student, auth: state.auth }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {
  push: routeActions.push
})

export default connect(mapStateToProps, mapDispatchToProps)(StudentList)
