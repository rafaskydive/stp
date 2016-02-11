import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import expect from 'expect'
import moment from 'moment'

import database from '../../src/database'
import { jumpsTemplate } from '../../src/utils'
import * as actions from '../../src/actions/studentListActions'
import * as types from '../../src/constants'

const ACTIONS = Object.keys(actions)

function markAsTested(action) {
  ACTIONS.splice(ACTIONS.indexOf(action), 1)
}

after(() => {
  console.log('UNTESTED ACTIONS (studentList)', ACTIONS)
})

describe('studentList actions', () => {

  describe('sync actions', () => {

    describe('showStudent', () => {
      it('should create STUDENT_SHOW with the selected student', () => {
        const student = {
          _id: 'test-student'
        }
        const expectedAction = {
          type: types.STUDENT_SHOW,
          payload: student
        }
        expect(actions.showStudent(student)).toEqual(expectedAction)
      })
      markAsTested('showStudent')
    })

    describe('toggleSort', () => {
      it('should dispatch LIST_TOGGLE_SORT with payload of sortBy ', () => {
        const expectedAction = {
          type: types.LIST_TOGGLE_SORT,
          payload: { sortBy: 'name' }
        }
        expect(actions.toggleSort('name')).toEqual(expectedAction)
      })
      markAsTested('toggleSort')
    })

    describe('filterByName', () => {
      it('should dispatch LIST_FILTER_BY_NAME with payload of str', () => {
        expect(actions.filterByName('dav')).toEqual({type: types.LIST_FILTER_BY_NAME, payload: 'dav'})
      })
      markAsTested('filterByName')
    })
  })

  /******************************************************************************/
  /* ASYNC ACTIONS                                                              */
  /******************************************************************************/

  const middlewares = [ thunk ]
  const mockStore = configureMockStore(middlewares)

  describe('async actions', () => {
    after(function() {
      console.log("DELETING TEST STUDENTS")
      return (
        database.allDocs({keys:["test-student","test-student-two", "test-student-three", "save-note-student", "remove-note-student"]}).then(response => {
          return response.rows.map(row => database.remove(row.key, row.value.rev))
        })
      )
    })

    describe('fetchStudents', () => {
      it('should return LIST_RECEIVE_STUDENTS and an array of docs', (done) => {

        const expectedActions = [
          {
            type: types.LIST_REQUEST_STUDENTS
          },
          (a) => {
            expect(a.payload).toBeAn(Array)
          }
        ]
        const store = mockStore({ studentList: [] }, expectedActions, done)
        store.dispatch(actions.fetchStudents())
      })
      markAsTested('fetchStudents')
    })


  })
})
