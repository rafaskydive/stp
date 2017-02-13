import * as types from '../constants/studentConstants'

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
    case types.STUDENT_NEW:
      return Object.assign({}, initialState, action.payload)
    case types.STUDENT_RECIEVE:
    case types.STUDENT_SAVE:
    case types.STUDENT_SHOW:
      return {...action.payload}
    case types.STUDENT_ENABLE_FORM:
      return Object.assign({}, state, { modified: true } )
    case types.STUDENT_DISABLE_FORM:
      return Object.assign({}, state, { modified: false } )
    case types.STUDENT_EDIT_FIELD:
    case types.STUDENT_CREATE_NEXT_JUMP:
    case types.STUDENT_SET_INSTRUCTOR_ON_FIRST_JUMP:
    case types.STUDENT_CANCEL_NOTE:
    case types.STUDENT_CHANGE_NOTE:
      return Object.assign({}, state, action.payload)
    case types.STUDENT_SAVE_ERROR:
      return Object.assign({}, state, { errors: action.payload.errors })
    case types.STUDENT_CREATE_NOTE:
      return Object.assign({}, state, { new_note: {} })
    default:
      return state
  }
}
