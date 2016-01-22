import * as types from '../constants'
import database from '../database'
import { routeActions } from 'redux-simple-router'

export function newStudent() {
  console.log('newStudent()')
  return {
    type: types.NEW_STUDENT,
    payload: { new: true }
  }
}

export function nullStudent() {
  return {
    type: types.NULL_STUDENT,
    payload: {}
  }
}

export function requestStudent() {
  return {
    type: types.REQUEST_STUDENT,
    payload: null
  }
}

export function receiveStudent(json) {
  return {
    type: types.RECIEVE_STUDENT,
    payload: json
  }
}

export function fetchStudent(_id) {
  if(_id === 'new') { return {} }
  return dispatch => {
    dispatch(requestStudent())
    return database.get(_id)
    .then(doc => {dispatch(receiveStudent(doc))})
  }
}

export function saveStudent(student) {
  return dispatch => {
    dispatch({ type: types.REQUEST_PUT_STUDENT})
    if(! student._id) {
      student._id = student.name.replace(/ /, '-').toLowerCase()
    }
    delete(student.modified)
    delete(student.new)
    return database.put(student)
      .then(response => {
        dispatch(fetchStudent(response.id))
        dispatch(routeActions.push(`/student/${response.id}`))
      })
  }
}

export function editStudentField(field) {
  return {
    type: types.EDIT_STUDENT_FIELD,
    payload: field
  }
}
