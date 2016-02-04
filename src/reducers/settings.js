import * as types from '../constants'
import { fixJSON } from '../utils'

const initialState = require('../../settings')

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
