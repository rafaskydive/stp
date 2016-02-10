import * as types from '../constants'
import database from '../database'
import bcrypt from 'bcrypt-nodejs'

export function editField (target) {
  return {
    type: types.EDIT_AUTH_FIELD,
    payload: { field: target.name, value: target.value }
  }
}

export function login (user, push) {
  let hashed_password = "$2a$10$aiB5wJiPJO48i0JNQc5CluOUVcn47xYhpXkqnthlvQq7mMf.wn02G"
  let loggedIn = bcrypt.compareSync(user.password, hashed_password) ? user.username : false
  if (loggedIn) { push('/') }
  return {
    type: types.AUTH_LOGGED_IN,
    loggedIn: loggedIn
  }
}

export function logout () {
  return { type: types.AUTH_LOG_OUT }
}
