import expect from 'expect'
import reducer from '../../src/reducers/studentListReducer'
import * as types from '../../src/constants/studentListConstants'

describe('studentList reducer', () => {
  describe('LIST_TOGGLE_SORT', () => {
    describe("with names", () => {
      const state = {
        sortBy: null,
        sortDesc: false,
        students: [
          { name: "C" },
          { name: "D" },
          { name: "A" },
          { name: "B" }
        ]
      }

      it('should sort by name descending by default', () => {
        let expectedStudents = [
          { name: "A" },
          { name: "B" },
          { name: "C" },
          { name: "D" }
        ]
        expect(
          reducer(state, {
            type: types.LIST_TOGGLE_SORT,
            payload: { sortBy: "name" }
          })
        ).toEqual(
          {
            sortBy: "name",
            sortDesc: true,
            students: state.students,
            filteredStudents: expectedStudents
          }
        )
      })

      it('should sort by names ascending next', () => {
        let expectedStudents = [
          { name: "D" },
          { name: "C" },
          { name: "B" },
          { name: "A" }
        ]
        expect(
          reducer(Object.assign({}, state, {sortDesc:true}), {
            type: types.LIST_TOGGLE_SORT,
            payload: { sortBy: "name" }
          })
        ).toEqual(
          {
            sortBy: "name",
            sortDesc: false,
            students: state.students,
            filteredStudents: expectedStudents
          }
        )
      })

    })

    describe("with last_jump_date", () => {
      const state = {
        sortBy: null,
        sortDesc: false,
        students: [
          {
            name: "A",
            jumps: {
              "1": {jump_date: 1},
              "2": {jump_date: 2},
              "3": {jump_date: 4}
            }
          },
          {
            name: "B",
            jumps: {
              "1": {jump_date: 1},
              "2": {jump_date: 3},
              "3": {jump_date: 7}
            }
          },
          {
            name: "C",
            jumps: {
              "1": {jump_date: 1},
              "2": {jump_date: 2},
              "3": {jump_date: 3}
            }
          },
          {
            name: "D",
            jumps: {
              "1": {jump_date: 1},
              "2": {jump_date: 1},
              "3": {jump_date: 1}
            }
          }
        ]
      }

      it('should sort ascending', () => {
        expect(
          reducer(Object.assign({}, state, {sortDesc:true}), {
            type: types.LIST_TOGGLE_SORT,
            payload: { sortBy: "last_jump_date" }
          })
        ).toEqual(
          {
            sortBy: "last_jump_date",
            sortDesc: false,
            students: state.students,
            filteredStudents: Object.assign([], state.students).reverse()
          }
        )
      })

      it('should sort descending', () => {
        expect(
          reducer(Object.assign({}, state, {sortDesc:false}), {
            type: types.LIST_TOGGLE_SORT,
            payload: { sortBy: "last_jump_date" }
          })
        ).toEqual(
          {
            sortBy: "last_jump_date",
            sortDesc: true,
            students: state.students,
            filteredStudents: state.students
          }
        )
      })

    })

  })

})
