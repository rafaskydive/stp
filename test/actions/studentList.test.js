import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import expect from 'expect'
import moment from 'moment'

import database from '../../src/database'
import { jumpsTemplate } from '../../src/utils'
import * as actions from '../../src/actions/studentListActions'
import * as types from '../../src/constants/studentlistConstants'

describe('studentList actions', () => {

  describe('sync actions', () => {

    describe('toggleSort', () => {
      it('should dispatch LIST_TOGGLE_SORT with payload of sortBy ', () => {
        const expectedAction = {
          type: types.LIST_TOGGLE_SORT,
          payload: { sortBy: 'name' }
        }
        expect(actions.toggleSort('name')).toEqual(expectedAction)
      })
    })

    describe('filterByName', () => {
      it('should dispatch LIST_FILTER_BY_NAME with payload of str', () => {
        expect(actions.filterByName('dav')).toEqual({type: types.LIST_FILTER_BY_NAME, payload: 'dav'})
      })
    })
  })

  /******************************************************************************/
  /* ASYNC ACTIONS                                                              */
  /******************************************************************************/

  const middlewares = [ thunk ]
  const mockStore = configureMockStore(middlewares)

  describe('async actions', () => {

    describe('fetchStudents', () => {
      it('should return LIST_RECEIVE_STUDENTS and an array of docs', () => {
        const store = mockStore({})
        return store.dispatch(actions.fetchStudents())
          .then(() => {
            const expectedActions = store.getActions()
            expect(expectedActions.length).toBe(2)
            expect(expectedActions[1].payload).toBeAn(Array)
          })
      })
    })

  })
})
