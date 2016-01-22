import * as types from '../constants'

export function selectStudent(_id) {
  return {
    type: types.SELECT_STUDENT,
    payload: _id
  }
}
