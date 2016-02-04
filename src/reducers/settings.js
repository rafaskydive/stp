import * as types from '../constants'

const initialState = {
  localDatabase: "STP",
  remoteDatabase: "http://localhost:5984/my-pouch-db",
  videoFilePath: "",
  instructors: ["David Rose", "James Englund", "Kevin Purdy"]
}

function parseSettingsObj(obj) {
  const preParsedObj = JSON.parse(obj)
  const newObj = {}
  Object.keys(preParsedObj).map(key => {
    console.log('key', key)
    console.log('value', preParsedObj[key])
    console.log('typeof value', typeof preParsedObj[key])

    // match [] and {} Objects
    if(preParsedObj[key] && typeof preParsedObj[key] === 'string' && preParsedObj[key].match(/^(\[)/)) {
      newObj[key] = JSON.parse(preParsedObj[key].replace(/\\/g, ''))
    }
    if(preParsedObj[key] && typeof preParsedObj[key] === 'string' && preParsedObj[key].match(/^(\{)/)) {
      newObj[key] = JSON.parse(preParsedObj[key])
    }
    // match numbers
    if(preParsedObj[key] && typeof preParsedObj[key] === 'string' && preParsedObj[key].match(/^[\d]+/)) {
      newObj[key] = Number(JSON.parse(preParsedObj[key]))
    }

    else { newObj[key] = preParsedObj[key] }
  })
  console.log('newObj', newObj)
  return newObj
}

export default function settings (state=initialState, action) {
  switch (action.type) {

    case types.CHANGE_SETTING_VALUE:
      const settingObj = {}
      settingObj[action.payload.name] = action.payload.value
      return Object.assign({}, state, settingObj)

    case types.REQUEST_SAVE_SETTINGS:
      const parsedSettings = parseSettingsObj(action.payload.settings)
      return Object.assign({}, parsedSettings)
    default:
      return state
  }
}
