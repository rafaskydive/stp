import * as types from '../constants'
import database from '../database'
import config from '../config'

export function changeSettingValue(e) {
  return {
    type: types.CHANGE_SETTING_VALUE,
    payload: {name: e.name, value: e.value}
  }
}

export function saveSettings(settings) {
  return {
    type: types.REQUEST_SAVE_SETTINGS,
    payload: {settings: settings}
  }
}
