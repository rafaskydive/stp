import * as types from '../constants'

export default function student (state={}, action) {
  switch(action.type) {
    case types.NEW_STUDENT:
    case types.RECIEVE_STUDENT:
      return {...action.payload}
    default:
      return state
  }
}
