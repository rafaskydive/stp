import expect from 'expect'
import reducer from '../../src/reducers/settingsReducer'
import * as types from '../../src/constants/settingsConstants'
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

  describe('SETTINGS_CHANGE_VALUE', () => {

    it('should reassign a specified value in state object', () => {
      expect(
        reducer(state, {
          type: types.SETTINGS_CHANGE_VALUE,
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

  describe('SETTINGS_REQUEST_SAVE', () => {
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
          type: types.SETTINGS_REQUEST_SAVE,
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
