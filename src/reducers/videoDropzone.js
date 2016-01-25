import * as types from '../constants'

const initialState = {
  files: [],
  copy_in_progress: false
}

export default function videoDropzone (state=initialState, action) {
  switch (action.type) {
    case types.COPY_IN_PROGRESS:
      return Object.assign({}, state, { copy_in_progress: true })
    case types.COPY_COMPLETE:
      return Object.assign({}, state, { copy_in_progress: false })
    default:
      return state
  }
}
