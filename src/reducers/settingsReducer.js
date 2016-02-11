import * as types from '../constants/settingsConstants'
import { fixJSON } from '../utils'
const path = require('path')

let initialState = {
  modified: false,
  configuration: {}
}

try {
  initialState.configuration = JSON.parse(
    fs.readFileSync(
      path.join(storage.userConfig(), 'settings.json')
    )
  )
} catch (e) {
  console.log("settings reducer could not load settings.json:", e, "Falling back to default initialState.")
  initialState.configuration = {
    localDatabase: 'STP',
    remoteDatabase: null,
    videoFilePath: null,
    instructors: ["Please Edit","Your Instructor List", "In Settings"]
  }
}
export default function settings (state=initialState, action) {
  switch (action.type) {

    case types.CHANGE_SETTING_VALUE:
      let newConfiguration = Object.assign({}, state.configuration)
      newConfiguration[action.payload.name] = action.payload.value
      return Object.assign({}, state, {
        configuration: newConfiguration,
        modified: true
      })

    case types.REQUEST_SAVE_SETTINGS:
      const properConfiguration = fixJSON(action.payload.configuration)
      return Object.assign({}, state, {
        configuration: properConfiguration,
        modified: false
      })

    case types.CANCEL_SAVE_SETTINGS:
      return Object.assign({}, state, {
        modified: false
      })

    default:
      return state
  }
}
