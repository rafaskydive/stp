import * as types from '../constants'

const initialState = {
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
    default:
      return state
  }
}
