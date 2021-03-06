import * as types from '../constants/studentListConstants'

const initialState = {
  loading: true,
  students: [],
  filteredStudents: [],
  sortBy: null,
  sortDesc: true,
  nameFilter: null
}

export default function studentList (state=initialState, action) {
  switch (action.type) {
    case types.LIST_REQUEST_STUDENTS:
      return Object.assign({}, state, {
        loading: true
      })

    case types.LIST_RECEIVE_STUDENTS:
      return Object.assign({}, state, {
        students: [...action.payload],
        filteredStudents: [...action.payload],
        loading: false
      })

    case types.LIST_FILTER_BY_NAME:
      // sanitize input
      let input = action.payload.replace(/[^\w\-' ]+/, '')
      let re = RegExp(input, 'i')
      let filteredStudents = state.students.map(student => {
        if (student.name.match(re)) { return student }
      }).filter(n => { return n })
      return Object.assign({}, state, {nameFilter: action.payload.nameFilter, filteredStudents: filteredStudents})

    case types.LIST_TOGGLE_SORT:
      let students = state.students
      let sortedStudents = []
      let sortBy = action.payload.sortBy
      let sortDesc = state.sortDesc ? false : true
      let sortedNames = students.map(student => {
        return student.name
      }).sort()
      let sortedVisitDates = students.map(student => {
        return student.next_visit_date
      }).sort()
      if(sortBy === "name") {
        if (!sortDesc) { sortedNames.reverse() }
        sortedNames.map(name => {
          sortedStudents.push(students.find(student => { return student.name === name }))
        })
      }
      if(sortBy === "last_jump_date") {
        if (sortDesc) { sortedStudents = Object.assign([], state.students)  }
        else { sortedStudents = Object.assign([], state.students).reverse() }
      }
      if(sortBy === "next_visit_date") {
        if (sortDesc) { sortedVisitDates.reverse() }
        sortedVisitDates.map(date => {
          sortedStudents.push(students.find(student => { return student.next_visit_date === date }))
        })
      }
      return Object.assign({}, state, {
        sortBy: sortBy,
        sortDesc: sortDesc,
        filteredStudents: sortedStudents
      })
    default:
      return state
  }
}
