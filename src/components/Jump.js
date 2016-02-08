import React, { Component } from 'react'
import VideoPane from './VideoPane'
import JumpInfoForm from './JumpInfoForm'
import { jumpsTemplate } from '../utils'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
const path = require('path')

class Jump extends Component {
  componentWillMount () {
    if (this.props.student._id !== this.props.params.id) {
      this.props.fetchStudent(this.props.params.id)
    }
    if (this.props.params.id === 'new') {
      this.props.newStudent()
    }
  }

  render () {
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
    <VideoPaneWrapper {...props}/>
  </div>
)

export const JumpInfoPane = props => (
  <div className="pane pane-sm sidebar padded">
    <JumpInfoForm jump={jump(props.student, props.params)} {...props}/>
  </div>
)

export const VideoPaneWrapper = props => (
  <div className="pane pane-padded video-page">
    <VideoPane jump={jump(props.student, props.params)}/>
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
  return { student: state.student }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {
  push: routeActions.push
})

export default connect(mapStateToProps, mapDispatchToProps)(Jump)
