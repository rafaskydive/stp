import * as types from '../constants'

export default function student (state={}, action) {
  switch(action.type) {
    case types.NEW_STUDENT:
    case types.RECIEVE_STUDENT:
    case types.SAVE_STUDENT:
      return {...action.payload}
    case types.EDIT_STUDENT_FIELD:
      return Object.assign({}, state, action.payload)
    default:
      return state
  }
}
