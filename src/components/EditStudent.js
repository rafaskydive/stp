import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as types from '../constants'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'

class EditStudent extends Component {

  componentDidMount () {
    if (this.props.student._id === null) {
      // this.props.fetchStudent(this.props.params.id)
    }
  }

  handleCancel() {
    this.props.goBack()
  }

  handleSubmit(e) {
    e.preventDefault()
    if (!this.props.student.modified) {
      return {}
    }
    this.props.saveStudent(this.props.student)
    this.props.goBack()
  }

  handleFormChange(e) {
    let field = {}
    field['modified'] = true
    field[`${e.target.name}`] = e.target.value
    this.props.editStudentField(field)
  }

  render () {
    let { student } = {...this.props}
    return (
      <div className="pane-group">
        <div className="pane">
          <header className="sub-header">
            <div className="toolbar-actions">
              <div className="btn-group pull-right">
                {(() => {
                  if(this.props.student.modified) {
                    return (
                      <button className="btn btn-primary" onClick={(e) => this.handleSubmit(e)}>
                        <span className="icon icon-install icon-text"></span>
                        Save
                      </button>
                    )
                  }
                })()}

                <button className="btn btn-default" onClick={() => this.handleCancel()}>
                  <span className="icon icon-ccw icon-text"></span>
                  Cancel
                </button>
              </div>
              <span className="page-title">Edit Student</span>
              <span>{student.name}</span>
              <span>{student.phone}</span>
              <span>{student.email}</span>
            </div>
          </header>
          <div className="padded">
            <form onSubmit={(e) => this.handleSubmit(e)}>
              <div className="form-group">
                <label>Name</label>
                <input required
                  className="form-control"
                  type="text"
                  name="name"
                  ref="name"
                  placeholder="Firstname Lastname"
                  value={student.name}
                  onChange={(e) => this.handleFormChange(e)}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input required
                  className="form-control"
                  type="email"
                  name="email"
                  ref="email"
                  placeholder="email@example.com"
                  value={student.email}
                  onChange={(e) => this.handleFormChange(e)}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input required
                  pattern="(\d{3})-(\d{3})-(\d{4})"
                  title="Must be in format '123-456-7890'"
                  className="form-control"
                  type="tel"
                  name="phone"
                  ref="phone"
                  placeholder="123-456-7890"
                  value={student.phone}
                  onChange={(e) => this.handleFormChange(e)}
                />
              </div>
              <button type="submit" style={{display: 'none'}}></button>
            </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditStudent)
