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
      let students = state.students
      const sortedStudents = []
      let sortBy = action.payload.sortBy
      let sortDesc = state.sortDesc ? false : true
      let sortedNames = students.map(student => {
        return student.name
      }).sort()
      let sortedDates = students.map(student => {
        return student.last_jump_date
      }).sort()
      if(sortBy === "name") {
        if (!sortDesc) { sortedNames.reverse() }
        sortedNames.map(name => {
          sortedStudents.push(students.find(student => { return student.name === name }))
        })
      }
      if(sortBy === "last_jump_date") {
        if (!sortDesc) { sortedDates.reverse() }
        sortedDates.map(date => {
          sortedStudents.push(students.find(student => { return student.last_jump_date === date }))
        })
      }
      return Object.assign({}, state, {
        sortBy: sortBy,
        sortDesc: sortDesc,
        students: sortedStudents
      })
    default:
      return state
  }
}
