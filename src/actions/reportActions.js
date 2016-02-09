import * as types from '../constants'
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
    dispatch({ type: types.REQUEST_REPORT_DATA })
    database.query(query, {group_level: 2}, (err, response) => {
      if (err) { console.log(err) }
      dispatch(
        {
          type: types.RECIEVE_JUMPS_BY_DATE,
          payload: response.rows
        }
      )
    })
  }
}
