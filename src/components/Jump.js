import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import VideoDropzone from './VideoDropzone'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import moment from 'moment'
const path = require('path')


class Jump extends Component {
  jump () {
    return this.props.student.jumps[this.props.params.jump_id]
  }

  componentDidMount () {
    if (this.props.student._id === null) {
      this.props.fetchStudent(this.props.params.id)
    }
  }

  goBack() {
    this.props.goBack()
  }

  handleEditField(e) {
    let field = e.target.name
    let value = e.target.value
    this.props.editJumpField(this.props.student, this.jump(), field, value)
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.saveStudent(this.props.student)
  }

  render () {
    let { student } = {...this.props}
    if (this.props.student._id === null) { return <div></div> }

    // let jump = student.jumps[this.props.params.jump_id]
    let jump = this.jump()
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
              <form onSubmit={e => this.handleSubmit(e)}>
                <div className="form-group">
                  <label>Jump Number</label>
                  <input
                    onChange={e => this.handleEditField(e)}
                    value={jump.jump_number}
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
                    ref="instructor"
                    name="instructor"
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-form btn-primary">Save</button>
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
  goBack: routeActions.goBack
})

export default connect(mapStateToProps, mapDispatchToProps)(Jump)
