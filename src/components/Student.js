import React, { Component } from 'react'
import StudentInfoForm from './StudentInfoForm'
import JumpList from './JumpList'
import Notes from './Notes'
import ErrorStatus from './ErrorStatus'
import ConditionalInput from './ConditionalInput'
import InstructorInput from './InstructorInput'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import moment from 'moment'

class Student extends Component {
  render() {
    return (
      <div className="window-content">
        <PaneGroup {...this.props}/>
      </div>
    )
  }
}

export const PaneGroup = props => (
  <div className="pane-group">
    <StudentInfoPane {...props}/>
    <StudentTabsPane {...props}/>
  </div>
)

export const StudentInfoPane = props => (
  <div className="pane pane-sm sidebar padded">
    <StudentInfoForm {...props}/>
  </div>
)

export const StudentTabsPane = props => {
  let { student, location } = {...props}
  let TabComponent = activeTab(location) === 'jumps' ? JumpList : Notes
  return (
    <div className="pane">
      <Tabs {...props}/>
      <TabComponent student={student} {...props}/>
    </div>
  )
}

export const Tabs = ({location, push}) => (
  <div className="tab-group">
    <div className={activeTab(location) === "jumps" ? "tab-item active" : "tab-item"}
      onClick={() => setActiveTab('jumps', location, push)}>
      Jumps
    </div>
    <div className={activeTab(location) === "notes" ? "tab-item active" : "tab-item"}
      onClick={() => setActiveTab('notes', location, push)}>
      Notes
    </div>
  </div>
)

const activeTab = (location) => {
  if ( location.query.tab && location.query.tab === 'notes') { return 'notes' }
  return 'jumps'
}

export const setActiveTab = (tab, location, push) => {
  let path = `${location.pathname}?tab=${tab}`
  console.log(path)
  push(path)
}

function mapStateToProps(state) {
  return { student: state.student }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {
  push: routeActions.push
})
export default connect(mapStateToProps, mapDispatchToProps)(Student)
