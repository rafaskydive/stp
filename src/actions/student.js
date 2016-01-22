import * as types from '../constants'

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
  return dispatch => {
    dispatch(requestStudent())
    return fetch(`http://localhost:5984/my-pouch-db/${_id}`)
      .then(response => response.json())
      .then(json => {
          dispatch(receiveStudent(json))
        }
      )
  }
}
