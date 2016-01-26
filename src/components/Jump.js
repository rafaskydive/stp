import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import VideoDropzone from './VideoDropzone'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import moment from 'moment'
const path = require('path')


class Jump extends Component {
  componentDidMount () {
    if (this.props.student._id === null) {
      this.props.fetchStudent(this.props.params.id)
    }
  }

  goBack() {
    this.props.goBack()
  }

  render () {
    let { student } = {...this.props}
    if (this.props.student._id === null) { return <div></div> }

    let jump = student.jumps[this.props.params.jump_id]
    return (
      <div className="pane-group">
        <div className="pane">
          <header className="sub-header">
            <div className="toolbar-actions">
              <div className="btn-group pull-right">
                <button className="btn btn-default" onClick={() => this.goBack()}>
                  <span className="icon icon-left-open icon-text"></span>
                  Back
                </button>
              </div>
              <span className="page-title">{student.name}</span>
            </div>
          </header>
          <div className="sub-pane-group">
            <div className="pane pane-sm sidebar padded">
              <strong>Jump {jump.jump_number} - Dive Flow {jump.dive_flow}</strong>
              <p>{moment(jump.date).format("MMMM Do YYYY")}</p>
            </div>
            <div className="pane padded">
              <VideoDropzone student={student} jump={jump} copyVideoFile={this.props.copyVideoFile} saveStudent={this.props.saveStudent}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { student: state.student }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {
  goBack: routeActions.goBack
})

export default connect(mapStateToProps, mapDispatchToProps)(Jump)
