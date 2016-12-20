import * as types from '../constants/instructorConstants'

const initialState = []

export default function instructorOptions (state=initialState, action) {
  switch(action.type) {
    case types.RECIEVE_INSTRUCTOR_OPTIONS:
      return action.payload
    default:
      return state
  }
}
