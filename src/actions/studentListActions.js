import * as types from '../constants/studentListConstants.js'
import database from '../database'
import designDocs from '../utils/designDocs'

function requestStudents() {
  return {
    type: types.LIST_REQUEST_STUDENTS,
  }
}

function receiveStudents(response) {
  return {
    type: types.LIST_RECEIVE_STUDENTS,
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
    const functionOrView = process.env['NODE_ENV'] === 'test' ? query : 'students/last_jump_date'
    dispatch(requestStudents())
    // database.query(functionOrView, { include_docs: true, descending: true }, (err, response) => {
    //   if (err) {
    //     console.log(err)
    //     designDocs.create(database)
    //   }
    //   return dispatch(receiveStudents(response))
    // })
    return database.query(functionOrView, { include_docs: true, descending: true})
      .then((response) => {
        return dispatch(receiveStudents(response))
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

export function toggleSort(attr) {
  return {
    type: types.LIST_TOGGLE_SORT,
    payload: { sortBy: attr }
  }
}

export function filterByName(str) {
  return {
    type: types.LIST_FILTER_BY_NAME,
    payload: str
  }
}
