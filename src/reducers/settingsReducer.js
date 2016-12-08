import * as types from '../constants/settingsConstants'
import { fixJSON } from '../utils'
const path = require('path')

let initialState = {
  modified: false,
  configuration: {}
}

const test = process.env['NODE_ENV'] === 'test'

const initialSettings = {
  localDatabase: 'STP',
  remoteDatabase: null,
  videoFilePath: null,
  instructors: ["Please Edit","Your Instructor List", "In Settings"]
}

if ( test ) { initialState.configuration = initialSettings }
else {
  try {
    initialState.configuration = JSON.parse(
      fs.readFileSync(
        path.join(storage.userConfig(), 'settings.json')
      )
    )
  } catch (e) {
    console.log("settings reducer could not load settings.json:", "Falling back to default initialState.")
    initialState.configuration = initialSettings
  }
}

export default function settings (state=initialState, action) {
  switch (action.type) {

    case types.SETTINGS_CHANGE_VALUE:
      let newConfiguration = Object.assign({}, state.configuration)
      newConfiguration[action.payload.name] = action.payload.value
      return Object.assign({}, state, {
        configuration: newConfiguration,
        modified: true
      })

    case types.SETTINGS_REQUEST_SAVE:
      const properConfiguration = fixJSON(action.payload.configuration)
      return Object.assign({}, state, {
        configuration: properConfiguration,
        modified: false
      })

    case types.SETTINGS_CANCEL_SAVE:
      return Object.assign({}, state, {
        modified: false
      })

    default:
      return state
  }
}
