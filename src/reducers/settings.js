import * as types from '../constants'

const initialState = {
  localDatabase: "STP",
  remoteDatabase: "http://localhost:5984/my-pouch-db",
  videoFilePath: null,
  instructors: ["David Rose", "James Englund", "Kevin Purdy"]
}

function parseSettingsObj(obj) {
  const preParsedObj = JSON.parse(obj)
  const newObj = {}
  Object.keys(preParsedObj).map(key => {
    if(preParsedObj[key] && preParsedObj[key].match(/^(\[|\{)/)) {
      newObj[key] = JSON.parse(preParsedObj[key].replace(/\\/g, ''))
    }
    else { newObj[key] = preParsedObj[key] }
  })
  return newObj
}

export default function settings (state=initialState, action) {
  switch (action.type) {

    case types.CHANGE_SETTING_VALUE:
      const settingObj = {}
      settingObj[action.payload.name] = action.payload.value
      // const parsedSettingObj = parseSettingsObj(JSON.stringify(settingObj))
      return Object.assign({}, state, settingObj)

    case types.REQUEST_SAVE_SETTINGS:
      const parsedSettings = parseSettingsObj(action.payload.settings)
      return Object.assign({}, parsedSettings)
    default:
      return state
  }
}
