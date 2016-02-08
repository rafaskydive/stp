import React, { Component } from 'react'
import ConditionalInput from './ConditionalInput'
import InstructorInput from './InstructorInput'
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

export const EnableFormButton = ({enableStudentEditForm}) => (
  <button className="btn btn-default" onClick={e => {e.preventDefault(); enableStudentEditForm()}}>
    <span className="icon icon-pencil icon-text"></span>
    Edit
  </button>
)

export const SaveAndCancelButtons = ({student, disableStudentEditForm}) => (
  <div>
    <button type="submit" className="btn btn-primary">
      <span className="icon icon-install icon-text"></span>
      Save
    </button>
    <button className="btn btn-default" onClick={e => {
        e.preventDefault();
        if (student._id === 'new') { return push('/') }
        disableStudentEditForm(student)
      }}>
      <span className="icon icon-ccw icon-text"></span>
      Cancel
    </button>
  </div>
)
