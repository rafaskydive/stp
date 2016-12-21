import * as types from '../constants/logEntryConstants'
import database from '../database'

export function requestLogEntryOptions() {
  return dispatch => {
    dispatch({type: types.REQUEST_LOG_ENTRY_OPTIONS})
    // I'm also monkeywrenching in aircraft from dzOptions, rather than
    // building a whole new action/reducer/etc setup for it
    let options = {
      keys: ['_design/logEntryOptions','_design/dzOptions'],
      include_docs: true
    }
    return database.allDocs(options)
      .then(res => {
        let docs = res.rows.map(row => row.doc)
        let dzOptions = docs.find(doc => doc._id === '_design/dzOptions')
        let logEntryOptions = docs.find(doc => doc._id === '_design/logEntryOptions')
        logEntryOptions.aircraft = dzOptions.aircraft
        return dispatch({type: types.RECIEVE_LOG_ENTRY_OPTIONS, payload: logEntryOptions})
      })
      .catch(err => console.log(err))
  }
}
