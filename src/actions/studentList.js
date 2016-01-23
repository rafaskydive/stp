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
    return database.query("app/by_name", { include_docs: true })
      .then(response => {
        dispatch(receiveStudents(response))
      })
  }
}

function requestPutStudent() {
  return {
    type: REQUEST_PUT_STUDENT
  }
}
