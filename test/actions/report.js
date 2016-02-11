import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import expect from 'expect'
import moment from 'moment'

import database from '../../src/database'
import { jumpsTemplate } from '../../src/utils'
import * as actions from '../../src/actions/reportActions'
import * as types from '../../src/constants'

const ACTIONS = Object.keys(actions)

function markAsTested(action) {
  ACTIONS.splice(ACTIONS.indexOf(action), 1)
}

after(() => {
  console.log('UNTESTED ACTIONS (report)', ACTIONS)
})

describe('auth actions', () => {

  describe('sync actions', () => {

  })
  /******************************************************************************/
  /* ASYNC ACTIONS                                                              */
  /******************************************************************************/

  const middlewares = [ thunk ]
  const mockStore = configureMockStore(middlewares)

  describe('async actions', () => {


  })
})
