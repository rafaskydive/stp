import * as types from '../constants'

const initialState = {}

export default function student (state={}, action) {
  switch(action.type) {
    case types.RECIEVE_STUDENT:
      return Object.assign({}, state, {...action.payload})
    default:
      return state
  }
}
