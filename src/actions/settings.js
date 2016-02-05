import * as types from '../constants'
import database from '../database'
import { fixJSON } from '../utils'
const path = require('path')

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
    mkdirp(storage.userConfig(), (err) => {
      if (err) { return console.log(err) }
      fs.writeFileSync(path.join(storage.userConfig(), 'settings.json'), JSON.stringify(properSettingsObj, null, 2))
      dispatch({
        type: types.SETTINGS_SAVED,
        payload: properSettingsObj
      })
    })
  }
}
