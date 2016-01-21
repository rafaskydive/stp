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

    default:
      return state
  }
}
