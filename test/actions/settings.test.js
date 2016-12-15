import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
// import expect from 'expect'
import moment from 'moment'

import database from '../../src/database'
import { jumpsTemplate } from '../../src/utils'
import * as actions from '../../src/actions/settingsActions'
import * as types from '../../src/constants/settingsConstants'

const mkdirpPromise = require('mkdirp-promise')

const ACTIONS = Object.keys(actions)

function markAsTested(action) {
  ACTIONS.splice(ACTIONS.indexOf(action), 1)
}
//
// after(() => {
//   console.log('UNTESTED ACTIONS (settings)', ACTIONS)
// })

describe('settings actions', () => {
  describe('sync actions', () => {

    describe('changeSettingValue', () => {
      it('should return SETTINGS_CHANGE_VALUE with a payload of an object containing name and value', () => {
        let e = {name: 'email', value: 'doppler@'}
        expect(actions.changeSettingValue(e)).toEqual({
          type: types.SETTINGS_CHANGE_VALUE,
          payload: {name: 'email', value: 'doppler@'}
        })
      })
      markAsTested('changeSettingValue')
    })

    describe('cancelSaveSettings', () => {
      it('should return SETTINGS_CANCEL_SAVE', () => {
        expect(actions.cancelSaveSettings()).toEqual({
          type: types.SETTINGS_CANCEL_SAVE
        })
      })
      markAsTested('cancelSaveSettings')
    })

  })

  /******************************************************************************/
  /* ASYNC ACTIONS                                                              */
  /******************************************************************************/

  const middlewares = [ thunk ]
  const mockStore = configureMockStore(middlewares)

  describe('async actions', () => {

    describe('saveSettings', () => {

      it('should return SETTINGS_REQUEST_SAVE and SETTINGS_SAVED', () => {
        const mkdirp = require('mkdirp')
        const fs = require('fs')
        const storage = { userConfig: function(){return './test'}}
        const settings = {
          name: 'value'
        }
        const store = mockStore({})
        return store.dispatch(actions.saveSettings(JSON.stringify(settings), mkdirpPromise, fs, storage))
          .then(() => {
            const expectedActions = store.getActions()
            expect(expectedActions.length).toBe(2)
            expect(expectedActions[0].type).toEqual(types.SETTINGS_REQUEST_SAVE)
            expect(expectedActions[1].payload.name).toEqual("value")
          })
      })
      markAsTested('saveSettings')
    })

  })

})
