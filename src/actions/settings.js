import * as types from '../constants'
import database from '../database'
import config from '../config'
import { fixJSON } from '../utils'

export function changeSettingValue(e) {
  return {
    type: types.CHANGE_SETTING_VALUE,
    payload: {name: e.name, value: e.value}
  }
}

export function saveSettings(settings) {
  return dispatch => {
    dispatch({
      type: types.REQUEST_SAVE_SETTINGS,
      payload: {settings: settings}
    })
    let properSettingsObj = fixJSON(settings)
    fs.writeFileSync("./settings.json", JSON.stringify(properSettingsObj, null, 2))
    dispatch({
      type: types.SETTINGS_SAVED,
      payload: properSettingsObj
    })
  }
}
