import React, { Component } from 'react'
import ErrorStatus from './ErrorStatus'
import InstructorInput from './InstructorInput'
import InlineConfirmButton from 'react-inline-confirm'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import moment from 'moment'

class Student extends Component {
  componentDidMount() {
    if (this.props.params.id === 'new') {
      return this.props.newStudent()
    }
    return this.props.fetchStudent(this.props.params.id)
  }

  handleEditField(e) {
    let field = e.target.name
    let value = e.target.value
    this.props.editStudentField(this.props.student, field, value)
  }

  enableForm(e) {
    e.preventDefault()
    this.props.enableStudentEditForm()
  }

  disableForm(e) {
    e.preventDefault()
    if (this.props.student._id === 'new') { return this.props.push('/') }
    this.props.disableStudentEditForm(this.props.student)
  }

  handleSubmit(e) {
    e.preventDefault()
    if (!this.props.student.modified) {
      return {}
    }
    this.props.saveStudent(this.props.student)
  }

  showStudentJump(student, jump) {
    if (student._id === 'new') { return alert("Please save student first.") }
    this.props.push(`/student/${student._id}/jump/${jump.jump_date}`)
  }

  createNextJump() {
    this.props.createNextJump(this.props.student)
    this.render()
  }

  removeJump(jump) {
    this.props.removeJump(this.props.student, jump)
  }

  _sortedJumps() {
    return this.props.student.jumps.sort((a, b) => {
      return a.jump_date > b.jump_date
    })
  }
  render() {
    let { student } = {...this.props}
    return (
      <div className="pane-group">
        <div className="pane">
          <header className="sub-header">
            <div className="toolbar-actions text-center">
              <div className="btn-group pull-left">
                <button className="btn btn-default" onClick={() => this.props.push('/')}>
                  <span className="icon icon-left-open icon-text"></span>
                  Back
                </button>
              </div>
              <span className="page-title">{student.name || "New Student"}</span>
              <ErrorStatus errors={student.errors}/>
            </div>
          </header>
          <div className="sub-pane-group">
            <div className="pane pane-sm sidebar padded">
              <form onSubmit={e => this.handleSubmit(e)}>
                <div className="form-group">
                  <label>Name</label>
                  <input required
                    onChange={e => this.handleEditField(e)}
                    value={student.name}
                    disabled={!student.modified}
                    ref="name"
                    name="name"
                    type="text"
                    placeholder="Firstname Lastname"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input required
                    onChange={e => this.handleEditField(e)}
                    value={student.email}
                    disabled={!student.modified}
                    ref="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input required
                    onChange={e => this.handleEditField(e)}
                    value={student.phone}
                    disabled={!student.modified}
                    ref="phone"
                    name="phone"
                    type="tel"
                    pattern="(\d{3})-(\d{3})-(\d{4})"
                    title="Must be in format '123-456-7890'"
                    placeholder="123-456-7890"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Instructor</label>
                  <InstructorInput
                    disabled={!student.modified}
                    value={student.instructor}
                    onChange={e => this.handleEditField(e)}
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
            <div className="pane">
              <ul className="list-group">
                {(() => { if (!student.new && this.props.student.modified) {
                  return (
                    <li className="list-group-header">
                      <button className="btn btn-default" onClick={e => this.createNextJump(e)}>
                        <span className="icon icon-list-add icon-text"></span>
                        Add New Jump
                      </button>
                    </li>
                  )
                }})()}
                {this._sortedJumps().map(jump => {
                  return (
                    <li className="list-group-item" key={jump.jump_date}>
                      <div className="media-body pull-left"
                          onClick={e => this.showStudentJump(student, jump)}>
                        <strong>
                          Jump {jump.jump_number} -
                          Dive Flow {jump.dive_flow} -
                          Instructor {jump.instructor}
                        </strong>
                        <p>Date: {moment(jump.jump_date).format('dddd, MMMM Do YYYY')}</p>
                        <p>Video: {jump.video_file}</p>
                      </div>
                      {(() => { if(this.props.student.modified) {
                        return (
                          <span className="pull-right">
                            <InlineConfirmButton
                              className="btn btn-default"
                              textValues={["Remove Jump", "Are you sure?", "Removing..."]}
                              showTimer={true}
                              isExecuting={false}
                              onClick={e => this.removeJump(jump)}
                              >
                              <span className="icon icon-trash icon-text"></span>
                            </InlineConfirmButton>
                          </span>
                        )
                      }})()}
                    </li>
                  )
                })}
              </ul>
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
export default connect(mapStateToProps, mapDispatchToProps)(Student)
