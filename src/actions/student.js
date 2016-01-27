import * as types from '../constants'
import database from '../database'
import { routeActions } from 'redux-simple-router'
import { jumpsTemplate } from '../utils'
import moment from 'moment'
const now = moment().format()

export function newStudent(callback) {
  return dispatch => {
    let payload = { new: true, type: 'student', jumps: jumpsTemplate }
    dispatch({
      type: types.NEW_STUDENT,
      payload
    })
    callback()
  }
}

function requestStudent() {
  return {
    type: types.REQUEST_STUDENT,
  }
}

function receiveStudent(json) {
  return {
    type: types.RECIEVE_STUDENT,
    payload: json
  }
}

export function fetchStudent(_id) {
  if(_id === 'new') { return }
  return dispatch => {
    dispatch(requestStudent())
    database.get(_id, (err, doc) => {
      dispatch(receiveStudent(doc))
      return {}
    })
  }
}

export function saveStudent(student) {
  return dispatch => {
    dispatch({ type: types.REQUEST_PUT_STUDENT})
    if(! student._id || student._id === "new") {
      student._id = student.name.replace(/ /g, '-').toLowerCase()
    }
    delete(student.modified)
    delete(student.new)
    database.put(student, (err, response) => {
      if (err) { console.log(err) }
      return dispatch(fetchStudent(response.id))
    })
  }
}

export function editStudent(student) {
  return {
    type: types.EDIT_STUDENT,
    payload: student
  }
}

export function enableStudentEditForm() {
  return {
    type: types.ENABLE_STUDENT_EDIT_FORM,
  }
}

export function disableStudentEditForm(student) {
  return dispatch => {
    dispatch(fetchStudent(student._id))
    dispatch( { type: types.DISABLE_STUDENT_EDIT_FORM } )
  }
}

export function editStudentField(student, field, value) {
  student[field] = value
  return {
    type: types.EDIT_STUDENT_FIELD,
    payload: student
  }
}

export function editJumpField(student, jump, field, value) {
  value = value.match(/(\d+)/) ? Number(value) : value
  student.jumps[jump._id][field] = value
  return {
    type: types.EDIT_STUDENT_FIELD,
    payload: student
  }
}
