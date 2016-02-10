import * as types from '../constants'
import database from '../database'
import { fixJSON } from '../utils'
const path = require('path')

export function changeSettingValue(field) {
  return {
    type: types.CHANGE_SETTING_VALUE,
    payload: {name: field.name, value: field.value}
  }
}

export function saveSettings(configuration, mkdirp, fs, storage) {
  return dispatch => {
    dispatch({
      type: types.REQUEST_SAVE_SETTINGS,
      payload: {configuration: configuration}
    })
    let properConfiguration = fixJSON(configuration)
    mkdirp(storage.userConfig(), (err) => {
      if (err) { return console.log(err) }
      fs.writeFileSync(path.join(storage.userConfig(), 'settings.json'), JSON.stringify(properConfiguration, null, 2))
      dispatch({
        type: types.SETTINGS_SAVED,
        payload: properConfiguration
      })
    })
  }
}

export function cancelSaveSettings() {
  return { type: types.CANCEL_SAVE_SETTINGS }
}
