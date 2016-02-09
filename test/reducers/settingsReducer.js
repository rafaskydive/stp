import expect from 'expect'
import reducer from '../../src/reducers/settingsReducer'
import * as types from '../../src/constants'

describe('settings reducer', () => {
  const state = {
    localDatabase: "test-db",
    remoteDatabase: "http://localhost:5984/test-db",
    videoFilePath: "",
    instructors: ["Alice", "Bob"]
  }

  describe('CHANGE_SETTING_VALUE', () => {

    it('should reassign a specified value in state object', () => {
      expect(
        reducer(state, {
          type: types.CHANGE_SETTING_VALUE,
          payload: { name: "instructors", value: '["Alice", "Bob", "Chuck"]'}
        })
      ).toEqual(
        {
          localDatabase: "test-db",
          remoteDatabase: "http://localhost:5984/test-db",
          videoFilePath: "",
          instructors: "[\"Alice\", \"Bob\", \"Chuck\"]"
        }
      )
    })

  })

  describe('REQUEST_SAVE_SETTINGS', () => {
    const settings = {
      localDatabase: "test-db",
      remoteDatabase: "http://localhost:5984/test-db",
      videoFilePath: "",
      instructors: ["Foo"]
    }
    const stringifiedSettings = JSON.stringify(settings)
    it('should return JSON', () => {
      expect(
        reducer(state, {
          type: types.REQUEST_SAVE_SETTINGS,
          payload: { settings: stringifiedSettings }
        })
      ).toEqual(
        {
          localDatabase: "test-db",
          remoteDatabase: "http://localhost:5984/test-db",
          videoFilePath: "",
          instructors: ["Foo"]
        }

      )
    })

  })

})
