import * as types from '../constants'
import database from '../database'
import config from '../config'

export function addInstructor(name) {
  return {
    type: types.ADD_INSTRUCTOR,
    payload
  }
}
