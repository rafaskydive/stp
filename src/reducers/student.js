import * as types from '../constants'

const initialState = {
  _id: "new",
  name: "",
  email: "",
  phone: "",
  jumps: {},
  modified: true
}

export default function student (state=initialState, action) {
  switch(action.type) {
    case types.NEW_STUDENT:
      return Object.assign({}, initialState, action.payload)
    case types.RECIEVE_STUDENT:
    case types.SAVE_STUDENT:
    case types.SHOW_STUDENT:
      return {...action.payload}
    case types.ENABLE_STUDENT_EDIT_FORM:
    case types.ENABLE_JUMP_EDIT_FORM:
      return Object.assign({}, state, { modified: true } )
    case types.DISABLE_STUDENT_EDIT_FORM:
    case types.DISABLE_JUMP_EDIT_FORM:
      return Object.assign({}, state, { modified: false } )
    case types.EDIT_STUDENT_FIELD:
      return Object.assign({}, state, action.payload)
    default:
      return state
  }
}
