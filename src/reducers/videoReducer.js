import * as types from '../constants/videoConstants'

const initialState = {
  files: [],
  copy_in_progress: false,
  percent: 0,
  video_file: null
}

export default function video (state=initialState, action) {
  switch (action.type) {
    case types.VIDEO_COPY_PROGRESS:
      return Object.assign({}, state, {
        copy_in_progress: true,
        percent: action.payload.percent,
      })
    case types.VIDEO_COPY_COMPLETE:
      return Object.assign({}, state, {
        copy_in_progress: false,
        percent: 0,
        video_file: action.payload
      })
    default:
      return state
  }
}
