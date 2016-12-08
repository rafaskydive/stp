import * as types from '../constants/settingsConstants'
import { fixJSON } from '../utils'
const path = require('path')

export function changeSettingValue(field) {
  return {
    type: types.SETTINGS_CHANGE_VALUE,
    payload: {name: field.name, value: field.value}
  }
}

export function saveSettings(configuration, mkdirpPromise, fs, storage) {
  return dispatch => {
    dispatch({
      type: types.SETTINGS_REQUEST_SAVE,
      payload: {configuration: configuration}
    })
    let properConfiguration = fixJSON(configuration)
    return mkdirpPromise(storage.userConfig())
      .then(() => {
        fs.writeFileSync(path.join(storage.userConfig(), 'settings.json'), JSON.stringify(properConfiguration, null, 2))
        dispatch({ type: types.SETTINGS_SAVED, payload: properConfiguration })
      })
      .catch((err) => console.log(err))
  }
}

export function cancelSaveSettings() {
  return { type: types.SETTINGS_CANCEL_SAVE }
}
