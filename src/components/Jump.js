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

  jump () {
    return this.props.student.jumps[this.props.params.jump_id]
  }

  handleEditField(e) {
    let field = e.target.name
    let value = e.target.value
    this.props.editJumpField(this.props.student, this.jump(), field, value)
  }

  enableForm(e) {
    e.preventDefault()
    this.props.enableStudentEditForm()
  }

  disableForm(e) {
    e.preventDefault()
    this.props.disableStudentEditForm(this.props.student)
  }

  handleSubmit(e) {
    e.preventDefault()
    if (!this.props.student.modified) {
      return {}
    }
    this.props.saveStudent(this.props.student)
  }

  render () {
    let { student } = {...this.props}
    if (this.props.student._id === 'new') { return <div></div> }
    let jump = this.jump()
    return (
      <div className="pane-group">
        <div className="pane">
          <header className="sub-header">
            <div className="toolbar-actions">
              <div className="btn-group pull-right">
                <button className="btn btn-default" onClick={() => this.props.push(`/student/${student._id}`)}>
                  <span className="icon icon-left-open icon-text"></span>
                  Back
                </button>
              </div>
              <span className="page-title">{student.name || "New Student"}</span>
            </div>
          </header>
          <div className="sub-pane-group">
            <div className="pane pane-sm sidebar padded">
              <form onSubmit={e => this.handleSubmit(e)}>
                <div className="form-group">
                  <label>Jump Number</label>
                  <input
                    onChange={e => this.handleEditField(e)}
                    value={jump.jump_number}
                    disabled={!student.modified}
                    ref="jump_number"
                    name="jump_number"
                    type="number"
                    min={1}
                    max={100}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Dive Flow</label>
                  <input
                    onChange={e => this.handleEditField(e)}
                    value={jump.dive_flow}
                    disabled={!student.modified}
                    ref="dive_flow"
                    name="dive_flow"
                    type="number"
                    min={1}
                    max={18}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Instructor</label>
                  <input
                    onChange={e => this.handleEditField(e)}
                    value={jump.instructor}
                    disabled={!student.modified}
                    ref="instructor"
                    name="instructor"
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="form-actions">
                  {(() => { if(this.props.student.modified) {
                    return (
                      <div>
                        <button type="submit" className="btn btn-primary">
                          <span className="icon icon-install icon-text"></span>
                          Save
                        </button>
                        <button className="btn btn-default" onClick={e => this.disableForm(e)}>
                          <span className="icon icon-ccw icon-text"></span>
                          Cancel
                        </button>
                      </div>
                    )
                  } else {
                    return (
                      <button className="btn btn-default" onClick={e => this.enableForm(e)}>
                        <span className="icon icon-pencil icon-text"></span>
                        Edit
                      </button>
                    )
                  }})()}
                </div>
              </form>
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
  push: routeActions.push
})

export default connect(mapStateToProps, mapDispatchToProps)(Jump)
