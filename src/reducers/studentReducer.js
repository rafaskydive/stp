import * as types from '../constants'

const initialState = {
  _id: "new",
  name: "",
  email: "",
  phone: "",
  jumps: [],
  notes: [],
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
    case types.CREATE_NEXT_JUMP:
    case types.SET_INSTRUCTOR_ON_FIRST_JUMP:
    case types.CANCEL_NOTE:
    case types.CHANGE_NOTE_FIELD:
      return Object.assign({}, state, action.payload)
    case types.SAVE_STUDENT_ERROR:
      return Object.assign({}, state, { errors: action.payload.errors })
    case types.CREATE_NOTE:
      return Object.assign({}, state, { new_note: {} })
    default:
      return state
  }
}
