import * as types from '../constants'
import database from '../database'

export function newStudent() {
  return {
    type: types.NEW_STUDENT,
    payload: { new: true }
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
    return database.put(student)
      .then(response => {
        dispatch(fetchStudent(response.id))
      })
  }
}

export function editStudentField(field) {
  return {
    type: types.EDIT_STUDENT_FIELD,
    payload: field
  }
}
