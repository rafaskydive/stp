import * as types from '../constants'

const initialState = {
  loading: true,
  jumpsByMonth: []
}

export default function report (state=initialState, action) {
  switch (action.type) {
    case types.REPORT_REQUEST_DATA:
      return Object.assign({}, state, {
        loading: true
      })
    case types.REPORT_RECIEVE_DATA:
      return Object.assign({}, state, {
        jumpsByMonth: action.payload,
        loading: false
      })
    default:
      return state
  }
}
