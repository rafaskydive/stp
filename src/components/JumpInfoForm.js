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
    <div className="form-group">
      <label>Dive Flow</label>
      <input name="dive_flow" type="number" className="form-control"
        onChange={e => editJumpField(student, jump, e.target.name, e.target.value)}
        value={jump.dive_flow}
        disabled={!student.modified}
        min={1}
        max={18}/>
    </div>
    <div className="form-group">
      <label>Jump Number</label>
      <input name="jump_number" type="number" className="form-control"
        onChange={e => editJumpField(student, jump, e.target.name, e.target.value)}
        value={jump.jump_number}
        disabled={!student.modified}
        min={1}
        max={100}/>
    </div>
    <div className="form-group">
      <label>Instructor</label>
      <InstructorInput unconditional={true}
        disabled={!student.modified}
        value={jump.instructor}
        onChange={e => editJumpField(student, jump, e.target.name, e.target.value)}/>
    </div>
    <div className="form-group">
      <label>Jump Date</label>
      <input name="jump_date" type="date" className="form-control"
        onChange={e => editJumpField(student, jump, e.target.name, e.target.value)}
        value={moment(jump.jump_date).format('YYYY-MM-DD')}
        disabled={!student.modified}/>
    </div>
    {/*(
      student.modified ?
      <SaveAndCancelButtons student={student} disableStudentEditForm={disableStudentEditForm}/> :
      <EnableFormButton enableStudentEditForm={enableStudentEditForm}/>
    )*/}
  </form>
)
