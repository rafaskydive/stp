import * as types from '../constants'

const initialState = {
  loading: true,
  jumpsByMonth: []
}

export default function report (state=initialState, action) {
  switch (action.type) {
    case types.REQUEST_REPORT_DATA:
      return Object.assign({}, state, {
        loading: true
      })
    case types.RECIEVE_JUMPS_BY_DATE:
      return Object.assign({}, state, {
        jumpsByMonth: action.payload,
        loading: false
      })
    default:
      return state
  }
}
