import * as types from '../constants'

const initialState = {
  _id: "",
  _rev: "",
  name: "",
  email: "",
  phone: "",
  jumps: [],
  new: false
}

export default function student (state=initialState, action) {
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
