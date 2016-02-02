import React, { Component } from 'react'
import ErrorStatus from './ErrorStatus'
import InstructorInput from './InstructorInput'
import InlineConfirmButton from 'react-inline-confirm'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'
import * as actionCreators from '../actions'
import moment from 'moment'

class JumpList extends Component {

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
    )
  }
}

function mapStateToProps(state) {
  return { student: state.student }
}

const mapDispatchToProps = Object.assign({}, actionCreators, {
  push: routeActions.push
})
export default connect(mapStateToProps, mapDispatchToProps)(JumpList)
