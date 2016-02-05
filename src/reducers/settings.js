import * as types from '../constants'
import { fixJSON } from '../utils'
const path = require('path')

let initialState

try {
  initialState = JSON.parse(
    fs.readFileSync(
      path.join(storage.userConfig(), 'settings.json')
    )
  )
} catch (e) {
  console.log("settings reducer could not load settings.json:", e, "Falling back to default initialState.")
  initialState = {
    localDatabase: 'STP',
    remoteDatabase: null,
    videoFilePath: null,
    instructors: ["Please Edit","Your Instructor List", "In Settings"]
  }
}
export default function settings (state=initialState, action) {
  switch (action.type) {

    case types.CHANGE_SETTING_VALUE:
      const settingObj = {}
      settingObj[action.payload.name] = action.payload.value
      return Object.assign({}, state, settingObj)

    case types.REQUEST_SAVE_SETTINGS:
      const parsedSettings = fixJSON(action.payload.settings)
      return Object.assign({}, parsedSettings)

    default:
      return state
  }
}
