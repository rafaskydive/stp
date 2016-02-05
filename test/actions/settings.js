import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import expect from 'expect'
import moment from 'moment'

import database from '../../src/database'
import { jumpsTemplate } from '../../src/utils'
import * as actions from '../../src/actions/settings'
import * as types from '../../src/constants'

const mkdirp = require('mkdirp')

const ACTIONS = Object.keys(actions)

function markAsTested(action) {
  ACTIONS.splice(ACTIONS.indexOf(action), 1)
}

after(() => {
  console.log('UNTESTED ACTIONS (settings)', ACTIONS)
})

describe('settings actions', () => {
  describe('sync actions', () => {

    describe('changeSettingValue', () => {
      it('should return CHANGE_SETTING_VALUE with a payload of an object containing name and value', () => {
        let e = {name: 'email', value: 'doppler@'}
        expect(actions.changeSettingValue(e)).toEqual({
          type: types.CHANGE_SETTING_VALUE,
          payload: {name: 'email', value: 'doppler@'}
        })
      })
      markAsTested('changeSettingValue')
    })

  })

  /******************************************************************************/
  /* ASYNC ACTIONS                                                              */
  /******************************************************************************/

  const middlewares = [ thunk ]
  const mockStore = configureMockStore(middlewares)

  describe('async actions', () => {

    describe('saveSettings', () => {

      it('should return REQUEST_SAVE_SETTINGS and SETTINGS_SAVED', (done) => {
        const mkdirp = require('mkdirp')
        const fs = require('fs')
        const storage = { userConfig: function(){return './test'}}
        const settings = {
          name: 'value'
        }
        const expectedActions = [
          { type: types.REQUEST_SAVE_SETTINGS, payload: {settings: '{"name":"value"}'} },
          { type: types.SETTINGS_SAVED, payload: {name:"value"} }
        ]
        const store = mockStore({settings: settings}, expectedActions, done)
        store.dispatch(actions.saveSettings(JSON.stringify(settings), mkdirp, fs, storage))
      })
      markAsTested('saveSettings')
    })
  })

})
