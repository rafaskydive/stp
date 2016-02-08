import React, { Component } from 'react'
import ConditionalInput from './ConditionalInput'
import InstructorInput from './InstructorInput'
import { EnableFormButton, SaveAndCancelButtons } from './form-buttons'

export default class StudentInfoForm extends Component {
  render() {
    return (
      <Form {...this.props}/>
    )
  }
}

export const Form = ({student, editStudentField, enableStudentEditForm, disableStudentEditForm, saveStudent, deleteStudent, settings, push}) => (
  <form onSubmit={e => {
      e.preventDefault()
      if ( student.email === "_delete@me" ) return deleteStudent(student, settings, push)
      return student.modified ? saveStudent(student) : {}
    }}>
    <ConditionalInput required
      label="Name"
      onChange={e => editStudentField(student, e.target.name, e.target.value)}
      value={student.name}
      disabled={!student.modified}
      name="name"
      type="text"
      placeholder="Firstname Lastname"
      className="form-control"
    />
    <ConditionalInput required
      label="Email"
      onChange={e => editStudentField(student, e.target.name, e.target.value)}
      value={student.email}
      disabled={!student.modified}
      name="email"
      type="email"
      placeholder="email@example.com"
      className="form-control"
    />
    <ConditionalInput required
      label="Phone"
      onChange={e => editStudentField(student, e.target.name, e.target.value)}
      value={student.phone}
      disabled={!student.modified}
      name="phone"
      type="tel"
      pattern="(\d{3})-(\d{3})-(\d{4})"
      title="Must be in format '123-456-7890'"
      placeholder="123-456-7890"
      className="form-control"
    />
    <InstructorInput
      label="Instructor"
      disabled={!student.modified}
      value={student.instructor}
      onChange={e => editStudentField(student, e.target.name, e.target.value)}
    />
    {(
      student.modified ?
      <SaveAndCancelButtons student={student} disableStudentEditForm={disableStudentEditForm}/> :
      <EnableFormButton enableStudentEditForm={enableStudentEditForm}/>
    )}
  </form>
)
