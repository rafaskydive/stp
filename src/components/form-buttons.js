import React from 'react'

export const EnableFormButton = ({enableStudentEditForm}) => (
  <div className="form-actions">
    <button className="btn btn-default" onClick={e => {e.preventDefault(); enableStudentEditForm()}}>
      <span className="icon icon-pencil icon-text"></span>
      Edit
    </button>
  </div>
)

export const SaveAndCancelButtons = ({student, disableStudentEditForm, push}) => (
  <div className="form-actions">
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
