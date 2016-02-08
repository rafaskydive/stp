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

export const StudentTabsPane = props => (
  <div className="pane">
    <StudentTabs {...props}/>
  </div>
)

export class StudentTabs extends Component {
  constructor(props) {
    super(props)
    this.state = { activeTab: 'jumps' }
  }
  componentDidMount() {
    console.log(this.props.location.query.tab)
    if(this.props.location.query.tab) {
      this.setState({activeTab: this.props.location.query.tab})
    }
  }
  setActiveTab(tab) {
    let tabPath = `${this.props.location.pathname}?tab=${tab}`
    this.props.push(tabPath)
    this.setState( {activeTab: tab} )
  }

  render() {
    let { student } = {...this.props}
    let TabComponent = this.state.activeTab === 'jumps' ? JumpList : Notes
    // TODO: try to factor this down to flatter components
    return (
      <div>
        <div className="tab-group">
          <div className={this.state.activeTab === 'jumps' ? 'tab-item active' : 'tab-item'}
            onClick={() => this.setActiveTab('jumps') }>
            Jumps
          </div>
          <div className={this.state.activeTab === 'notes' ? 'tab-item active' : 'tab-item'}
            onClick={() => this.setActiveTab('notes') }>
            Notes
          </div>
        </div>
        <TabComponent student={student} {...this.props}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { student: state.student }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {
  push: routeActions.push
})
export default connect(mapStateToProps, mapDispatchToProps)(Student)
