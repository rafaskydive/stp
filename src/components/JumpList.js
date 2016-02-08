import React, { Component } from 'react'
import InlineConfirmButton from 'react-inline-confirm'
import moment from 'moment'

export default class JumpList extends Component {
  render () {
    return (
      <ul className="list-group">
        <ListGroupHeader {...this.props}/>
        {renderSortedJumpList(this.props)}
      </ul>
    )
  }
}

export const ListGroupHeader = ({student, createNextJump}) => {
  if (!student.new && student.modified) {
    return (
      <li className="list-group-header">
        <button className="btn btn-default" onClick={() => createNextJump(student)}>
          <span className="icon icon-list-add icon-text"></span>
          Add New Jump
        </button>
      </li>
    )
  }
  return <span></span>
}

export const renderSortedJumpList = ({student, push, removeJump}) => (
  student.jumps.sort((a, b) => {
    return a.jump_date > b.jump_date
  }).map(jump => renderJumpListItem(student, jump, push, removeJump))
)

export const renderJumpListItem = (student, jump, push, removeJump) => (
  <li className="list-group-item" key={jump.id}>
    <JumpListItem student={student} jump={jump} push={push} removeJump={removeJump}/>
  </li>
)

export const JumpListItem = ({student, jump, push, removeJump}) => (
  <div>
    <div className="media-body pull-left"
      onClick={() => {
        if (student._id === 'new') { return alert("Please save student first")}
        push(`/student/${student._id}/jump/${jump.id}`)
      }}>
      <strong>
        Dive Flow {jump.dive_flow} -
        Jump {jump.jump_number} -
        Instructor {jump.instructor}
      </strong>
      <p>Date: {moment(jump.jump_date).format('dddd, MMMM Do YYYY')}</p>
      <p>Video: {jump.video_file}</p>
    </div>
    <RemoveJumpButton student={student} jump={jump} removeJump={removeJump}/>
  </div>
)

export const RemoveJumpButton = ({student, jump, removeJump}) => {
  if (!student.modified) { return <span></span> }
  return (
    <span className="pull-right">
      <InlineConfirmButton
        className="btn btn-default"
        textValues={["Remove Jump", "Are you sure?", "Removing..."]}
        showTimer={true}
        isExecuting={false}
        onClick={e => removeJump(student, jump)}
        >
        <span className="icon icon-trash icon-text"></span>
      </InlineConfirmButton>
    </span>
  )
}
