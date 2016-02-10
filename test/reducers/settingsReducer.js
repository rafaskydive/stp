import expect from 'expect'
import reducer from '../../src/reducers/settingsReducer'
import * as types from '../../src/constants'
import { fixJSON } from '../../src/utils'

describe('settings reducer', () => {
  const state = {
    modified: false,
    configuration: {
      localDatabase: "test-db",
      remoteDatabase: "http://localhost:5984/test-db",
      videoFilePath: "",
      instructors: ["Alice", "Bob"]
    }
  }

  describe('CHANGE_SETTING_VALUE', () => {

    it('should reassign a specified value in state object', () => {
      expect(
        reducer(state, {
          type: types.CHANGE_SETTING_VALUE,
          payload: { name: "instructors", value: '["Alice", "Bob", "Chuck"]'}
        })
      ).toEqual({
        modified: true,
        configuration: {
          localDatabase: "test-db",
          remoteDatabase: "http://localhost:5984/test-db",
          videoFilePath: "",
          instructors: "[\"Alice\", \"Bob\", \"Chuck\"]"
        }
      })
    })

  })

  describe('REQUEST_SAVE_SETTINGS', () => {
    const settings = {
      modified: true,
      configuration: {
        localDatabase: "test-db",
        remoteDatabase: "http://localhost:5984/test-db",
        videoFilePath: "",
        instructors: ["Foo"]
      }
    }
    const { configuration } = {...settings}
    const stringifiedConfiguration = JSON.stringify(configuration)
    it('should return JSON', () => {
      expect(
        reducer(state, {
          type: types.REQUEST_SAVE_SETTINGS,
          payload: { configuration: stringifiedConfiguration }
        })
      ).toEqual({
        modified: false,
        configuration: {
          localDatabase: "test-db",
          remoteDatabase: "http://localhost:5984/test-db",
          videoFilePath: "",
          instructors: ["Foo"]
        }
      })
    })

  })

})
