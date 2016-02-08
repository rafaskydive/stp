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
  const query = {
    map: function(doc) {
      if(doc.type==='student' && doc.last_jump_date) {
        emit(doc.last_jump_date)
      }
    }
}
  return dispatch => {
    dispatch(requestStudents())
    database.query(query, { include_docs: true, descending: true }, (err, response) => {
      if (err) { console.log(err) }
      return dispatch(receiveStudents(response))
    })
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

export function filterByName(str) {
  return {
    type: types.FILTER_BY_NAME,
    payload: str
  }
}
