import * as types from '../constants'

const initialState = {
  selectedStudent: null,
  students: [
    {
      "_id": 1,
      "name": "David Rose"
    },
    {
      "_id": 2,
      "name": "Jokey McBokey"
    }
  ]
}

export default function studentList (state=initialState, action) {
  switch (action.type) {
    case types.RECIEVE_STUDENTS:
      return Object.assign({}, state, {
        students: [...action.payload]
      })
    case types.SELECT_STUDENT:
      let selectedStudent = state.students.find(o =>
        { return o._id === action.payload }
      )
      return Object.assign({}, state, {
        selectedStudent: selectedStudent
      })
    default:
      return state
  }
}
