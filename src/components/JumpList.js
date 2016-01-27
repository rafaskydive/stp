import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import moment from 'moment'

class Student extends Component {
  componentDidMount() {
    if (this.props.student._id === null) {
      this.props.fetchStudent(this.props.params.id)
    }
    if (this.props.student._id === "new") {
      this.props.newStudent(() => {
        return
      })
    }
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
    if (this.props.student._id === null) { return this.props.push('/') }
    this.props.disableStudentEditForm(this.props.student)
  }

  handleSubmit(e) {
    e.preventDefault()
    if (!this.props.student.modified) {
      return {}
    }
    this.props.saveStudent(this.props.student)
  }

  render() {
    let { student } = {...this.props}
    return (
      <div className="pane-group">
        <div className="pane">
          <header className="sub-header">
            <div className="toolbar-actions">
              <div className="btn-group pull-right">
                <button className="btn btn-default" onClick={() => this.props.push('/')}>
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
                {(() => { for ( let key of Object.keys(student.jumps) ) {
                  let jump = student.jumps[key]
                  return (
                    <li className="list-group-item" key={key}
                        onClick={e => this.props.push(`/student/${student._id}/jump/${jump._id}`)}>
                      <div className="media-body">
                        <strong>Dive Flow {jump.dive_flow}</strong>
                        <p>Date: {moment(jump.date).format('MMMM Do YYYY')}</p>
                      </div>
                    </li>
                  )
                }})()}
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
