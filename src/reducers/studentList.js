import * as types from '../constants'

const initialState = {
  students: [],
  sortBy: null,
  sortDesc: false
}

const addLastJumpAttr = function (students) {
  const _a = students.map(student => {
    student.last_jump_date = Object.keys(student.jumps).map(key => {
      return student.jumps[key].jump_date
    }).sort((a, b) => {
      return a > b
    }).pop()
    return student
  })
  return _a
}

export default function studentList (state=initialState, action) {
  switch (action.type) {
    case types.RECIEVE_STUDENTS:
      return Object.assign({}, state, {
        students: [...action.payload]
      })
    case types.TOGGLE_SORT:
      let sortBy = action.payload.sortBy
      let students = action.payload.sortBy === "name" ? state.students : addLastJumpAttr(state.students)
      let sortDesc = state.sortDesc ? false : true
      let sortedStudents = students.sort((a, b) => {
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
