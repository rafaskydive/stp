import React, { Component } from 'react'
import VideoPane from './VideoPane'
import JumpInfoForm from './JumpInfoForm'
import LogEntryForm from './LogEntryForm'
import { jumpsTemplate } from '../utils'
import { connect } from 'react-redux'
import { routeActions, push } from 'react-router-redux'
import * as actionCreators from '../actions'

class Jump extends Component {
  componentDidReceiveProps () {
    if (this.props.student._id !== this.props.params.id) {
      this.props.fetchStudent(this.props.params.id)
    }
    if (this.props.params.id === 'new') {
      this.props.newStudent()
    }
  }

  render () {
    if (this.props.student._id === "new") { return <div></div> }
    return (
      <div className="window-content">
        <PaneGroup {...this.props}/>
      </div>
    )
  }
}

export const PaneGroup = props => (
  <div className="pane-group">
    <JumpInfoPane {...props}/>
    <JumpTabsPane {...props}/>
  </div>
)

export const JumpTabsPane = props => {
  let { student, location, params } = {...props}
  let TabComponent = activeTab(location) === 'log_entry' ?  LogEntryForm : VideoPaneWrapper
  return (
    <div className="pane">
      <Tabs {...props}/>
      <TabComponent student={student} jump={jump(student, params)} {...props}/>
    </div>
  )
}

export const Tabs = ({student, location, push}) => (
  <div className="tab-group">
    <div className={activeTab(location) === "video" ? "tab-item active" : "tab-item"}
      onClick={() => setActiveTab('video', location, push)}>
      Video
    </div>
    <div className={activeTab(location) === "log_entry" ? "tab-item active" : "tab-item"}
      onClick={() => setActiveTab('log_entry', location, push)}>
      Log Entry
    </div>
  </div>
)

const activeTab = (location) => {
  if ( location.query.tab && location.query.tab === 'log_entry') { return 'log_entry' }
  return 'video'
}

export const setActiveTab = (tab, location, push) => {
  let path = `${location.pathname}?tab=${tab}`
  push(path)
}

export const JumpInfoPane = props => (
  <div className="pane pane-sm sidebar padded">
    <JumpInfoForm jump={jump(props.student, props.params)} {...props}/>
  </div>
)

export const VideoPaneWrapper = props => (
  <div className="pane pane-padded video-page">
    <VideoPane
      student={props.student}
      jump={jump(props.student, props.params)}
      video={props.video}
      copyVideoFile={props.copyVideoFile}
      removeVideo={props.removeVideo}
      saveStudent={props.saveStudent}
      settings={props.settings.configuration}
      />
  </div>
)

const jump = (student, params) => {
  return (
    student._id === 'new' ?
    jumpsTemplate :
    student.jumps.find(j => {
      return j.id === params.jump_id
    })
  )
}

function mapStateToProps(state) {
  return { student: state.student, settings: state.settings, video: state.video }
}

const mapDispatchToProps = Object.assign({}, {
  newStudent: actionCreators.newStudent,
  fetchStudent: actionCreators.fetchStudent,
  enableStudentEditForm: actionCreators.enableStudentEditForm,
  disableStudentEditForm: actionCreators.disableStudentEditForm,
  editJumpField: actionCreators.editJumpField,
  copyVideoFile: actionCreators.copyVideoFile,
  removeVideo: actionCreators.removeVideo,
  saveStudent: actionCreators.saveStudent,
  push: push
})

export default connect(mapStateToProps, mapDispatchToProps)(Jump)
