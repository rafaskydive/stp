import * as types from '../constants/reportConstants'
import database from '../database'

export function jumpsByMonth() {
  const query = {
    map: function(doc) {
      if(doc.type === 'student' && doc.jumps) {
        for(var i in doc.jumps) {
          emit(doc.jumps[i].jump_date.split(/T/)[0].split(/-/), 1)
        }
      }
    },
    reduce: "_count"
  }
  return dispatch => {
    dispatch({ type: types.REPORT_REQUEST_DATA })
    database.query('students/jumps_by_month', {group_level: 2}, (err, response) => {
      if (err) { console.log(err) }
      dispatch(
        {
          type: types.REPORT_RECIEVE_DATA,
          payload: response.rows
        }
      )
    })
  }
}
