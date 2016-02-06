import * as types from '../constants'

const initialState = {
  files: [],
  copy_in_progress: false,
  percent: 0,
  video_file: null
}

export default function video (state=initialState, action) {
  switch (action.type) {
    case types.COPY_PROGRESS:
      return Object.assign({}, state, {
        copy_in_progress: true,
        percent: action.payload.percent,
      })
    case types.COPY_COMPLETE:
      return Object.assign({}, state, {
        copy_in_progress: false,
        percent: 0,
        video_file: action.payload
      })
    default:
      return state
  }
}
