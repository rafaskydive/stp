import * as types from '../constants/logEntryConstants'

const initialState = {loaded: false}

export default function logEntryOptions (state=initialState, action) {
  switch (action.type) {
    case types.REQUEST_LOG_ENTRY_OPTIONS:
      return Object.assign({}, state, {
        loading: true
      })
    case types.RECIEVE_LOG_ENTRY_OPTIONS:
      return Object.assign({}, action.payload)
    default:
      return state
  }
}
