import React, { Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'

class Student extends Component {
  componentDidMount() {
    this.props.fetchStudent(this.props.params.id)
  }

  handleEditStudent(_id) {
    this.props.push(`/student/${_id}/edit`)
  }

  render() {
    let { student } = {...this.props}
    return (
      <div className="pane-group">
        <div className="pane">
          <header className="sub-header">
            <div className="toolbar-actions">
              <div className="btn-group pull-right">
                <button className="btn btn-default" onClick={() => this.handleEditStudent(student._id)}>
                  <span className="icon icon-pencil icon-text"></span>
                  Edit
                </button>
              </div>
              <span className="page-title">Student Jumps</span>
              <span>{student.name}</span>
              <span>{student.phone}</span>
              <span>{student.email}</span>
            </div>
          </header>
          <ul className="list-group">
            { student.jumps.map((jump, i) => {
              return (
                <li className="list-group-item" key={i}>
                  <div className="media-body">
                    <strong>Dive Flow {jump.dive_flow}</strong>
                    <p>Date: </p>
                  </div>
                </li>
              )
            })}
          </ul>
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
