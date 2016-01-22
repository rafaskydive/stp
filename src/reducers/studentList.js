import * as types from '../constants'

const initialState = {
  students: []
}

export default function studentList (state=initialState, action) {
  switch (action.type) {
    case types.RECIEVE_STUDENTS:
      return Object.assign({}, state, {
        students: [...action.payload]
      })
    default:
      return state
  }
}
