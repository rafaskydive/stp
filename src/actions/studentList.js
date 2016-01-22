import * as types from '../constants'

export function requestStudents() {
  return {
    type: types.REQUEST_STUDENTS,
    payload: null
  }
}

export function receiveStudents(json) {
  return {
    type: types.RECIEVE_STUDENTS,
    payload: json.rows.map(row => row.doc)
  }
}

export function fetchStudents() {
  return dispatch => {
    dispatch(requestStudents())
    return fetch('http://localhost:5984/my-pouch-db/_all_docs?include_docs=true')
      .then(response => response.json())
      .then(json =>
        dispatch(receiveStudents(json))
      )
  }
}
