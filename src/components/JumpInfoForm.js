import React, { Component } from 'react'
import ConditionalInput from './ConditionalInput'
import InstructorInput from './InstructorInput'
import { EnableFormButton, SaveAndCancelButtons } from './form-buttons'
import moment from 'moment'

export default class JumpInfoForm extends Component {
  render() {
    return (
      <Form {...this.props}/>
    )
  }
}

export const Form = ({student, jump, editJumpField, enableStudentEditForm, disableStudentEditForm, saveStudent}) => (
  <form onSubmit={e => {
      e.preventDefault()
      return student.modified ? saveStudent(student) : {}
    }}>
    <ConditionalInput
      label="Dive Flow"
      onChange={e => editJumpField(student, jump, e.target.name, e.target.value)}
      value={jump.dive_flow}
      disabled={!student.modified}
      name="dive_flow"
      type="number"
      min={1}
      max={18}
      className="form-control"
    />
    <ConditionalInput
      label="Jump Number"
      onChange={e => editJumpField(student, jump, e.target.name, e.target.value)}
      value={jump.jump_number}
      disabled={!student.modified}
      name="jump_number"
      type="number"
      min={1}
      max={100}
      className="form-control"
    />
    <InstructorInput
      label="Instructor"
      disabled={!student.modified}
      value={jump.instructor}
      onChange={e => editJumpField(student, jump, e.target.name, e.target.value)}
    />
    <ConditionalInput
      label="Jump Date"
      onChange={e => editJumpField(student, jump, e.target.name, e.target.value)}
      value={moment(jump.jump_date).format('YYYY-MM-DD')}
      disabled={!student.modified}
      name="jump_date"
      type="date"
      className="form-control"
    />
    {(
      student.modified ?
      <SaveAndCancelButtons student={student} disableStudentEditForm={disableStudentEditForm}/> :
      <EnableFormButton enableStudentEditForm={enableStudentEditForm}/>
    )}
  </form>
)
