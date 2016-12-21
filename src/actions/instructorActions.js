import * as types from '../constants/instructorConstants'
import database from '../database'

export function requestInstructorOptions() {
  return dispatch => {
    dispatch({type: types.REQUEST_INSTRUCTOR_OPTIONS})
    return database.get('_design/dzOptions')
      .then(res => {
        return dispatch({type: types.RECIEVE_INSTRUCTOR_OPTIONS, payload: res.instructors})
      })
      .catch(err => console.log(err))
  }
}
