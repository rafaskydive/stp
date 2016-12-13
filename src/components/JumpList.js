import React, { Component } from 'react'
import InlineConfirmButton from 'react-inline-confirm'
import moment from 'moment'

export default class JumpList extends Component {
  render () {
    return (
      <ul className="list-group">
        <ListGroupHeader {...this.props}/>
        <table className="table-striped">
          <thead>
            <tr>
              <th>Jump</th>
              <th>DF</th>
              <th>Date</th>
              <th>Instructor</th>
              <th>Exit Alt</th>
              <th>Deploy Alt</th>
              <th>Delay</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {renderJumpList(this.props)}
          </tbody>
        </table>

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

export const renderJumpList = ({student, push, removeJump}) => (
  student.jumps.map(jump => renderJumpListItem(student, jump, push, removeJump))
)

export const renderJumpListItem = (student, jump, push, removeJump) => (
  <tr key={jump.id}>
    <td onClick={() => displayJump(student, jump, push)}>{jump.jump_number}</td>
    <td onClick={() => displayJump(student, jump, push)}>{jump.dive_flow}</td>
    <td onClick={() => displayJump(student, jump, push)}>{moment(jump.jump_date).format('dddd, MMM Do YY')}</td>
    <td onClick={() => displayJump(student, jump, push)}>{jump.instructor}</td>
    <td onClick={() => displayJump(student, jump, push)}>{jump.exit_altitude}</td>
    <td onClick={() => displayJump(student, jump, push)}>{jump.deployment_altitude}</td>
    <td onClick={() => displayJump(student, jump, push)}>{delay(jump)}</td>
    <td><RemoveJumpButton student={student} jump={jump} removeJump={removeJump}/></td>
  </tr>
)

export const RemoveJumpButton = ({student, jump, removeJump}) => {
  if (!student.modified) { return <span></span> }
  return (
    <span className="pull-right">
      <InlineConfirmButton
        className="btn btn-default btn-mini"
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

const delay = (jump) => {
  if(jump.exit_altitude && jump.deployment_altitude) {
    return Math.ceil((((jump.exit_altitude - jump.deployment_altitude) / 1000) * 5.5) + 5) + " seconds"
  }
  return ""
}

const displayJump = (student, jump, push) => {
  if (student._id === 'new') { return alert("Please save student first")}
  push(`/student/${student._id}/jump/${jump.id}`)
}
