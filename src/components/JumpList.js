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
  }

  editStudent(student) {
    this.props.editStudent(student)
    this.props.push(`/student/${student._id}/edit`)
  }

  editJump(student, jump) {
    this.props.editJump(student, jump)
    this.props.push(`/student/${student._id}/jump/${jump._id}`)
  }

  render() {
    let { student } = {...this.props}
    return (
      <div className="pane-group">
        <div className="pane">
          <header className="sub-header">
            <div className="toolbar-actions">
              <div className="btn-group pull-right">
                <button className="btn btn-default" onClick={() => this.editStudent(student)}>
                  <span className="icon icon-pencil icon-text"></span>
                  Edit
                </button>
              </div>
              <span className="page-title">{student.name}</span>
            </div>
          </header>
          <div className="sub-pane-group">
            <div className="pane pane-sm sidebar padded">
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Phone:</strong> {student.phone}</p>
            </div>
            <div className="pane">
              <ul className="list-group">
                {(() => { for ( let key of Object.keys(student.jumps) ) {
                  let jump = student.jumps[key]
                  return (
                    <li className="list-group-item" key={key} onClick={e => this.editJump(student, jump)}>
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
