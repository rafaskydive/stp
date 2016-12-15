import * as types from '../constants/logEntryConstants'
import database from '../database'

export function requestLogEntryOptions() {
  return dispatch => {
    dispatch({type: types.REQUEST_LOG_ENTRY_OPTIONS})
    return database.get('_design/logEntryOptions')
      .then(res => {
        return dispatch({type: types.RECIEVE_LOG_ENTRY_OPTIONS, payload: res})
      })
      .catch(err => console.log(err))
  }
}
