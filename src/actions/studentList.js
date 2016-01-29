import * as types from '../constants'
import database from '../database'

function requestStudents() {
  return {
    type: types.REQUEST_STUDENTS,
  }
}

function receiveStudents(response) {
  return {
    type: types.RECIEVE_STUDENTS,
    payload: response.rows.map(row => row.doc)
  }
}

export function fetchStudents() {
  return dispatch => {
    dispatch(requestStudents())
    database.query('app/by_name', { include_docs: true }, (err, response) => {
      if (err) { console.log(err) }
      return dispatch(receiveStudents(response))
    })
  }
}

function requestPutStudent() {
  return {
    type: types.REQUEST_PUT_STUDENT
  }
}

export function showStudent(student) {
  return {
    type: types.SHOW_STUDENT,
    payload: student
  }
}

export function toggleSort(attr) {
  return {
    type: types.TOGGLE_SORT,
    payload: { sortBy: attr }
  }
}
