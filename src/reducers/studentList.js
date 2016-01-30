import * as types from '../constants'

const initialState = {
  students: [],
  sortBy: null,
  sortDesc: false
}

export default function studentList (state=initialState, action) {
  switch (action.type) {
    case types.RECIEVE_STUDENTS:
      return Object.assign({}, state, {
        students: [...action.payload]
      })
    case types.TOGGLE_SORT:
      let sortBy = action.payload.sortBy
      let sortDesc = state.sortDesc ? false : true
      let sortedStudents = state.students.sort((a, b) => {
        if(sortDesc) { return a[sortBy] > b[sortBy] }
        return a[sortBy] < b[sortBy]
      })
      return Object.assign({}, state, {
        sortBy: sortBy,
        sortDesc: sortDesc,
        students: sortedStudents
      })
    default:
      return state
  }
}
