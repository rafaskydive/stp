import * as types from '../constants/authConstants'
import database from '../database'
import bcrypt from 'bcrypt-nodejs'

export function editField (target) {
  return {
    type: types.AUTH_EDIT_FIELD,
    payload: { field: target.name, value: target.value }
  }
}

export function login (user, callback) {
  return dispatch => {
    database.get('users', (err, users) => {
      if (err && err.status == 404) {
        return dispatch({
          type: types.AUTH_ERROR,
          error: "Users doc not found in DB"
        })
      }
      let foundUser = users[user.username]
      if (! foundUser ) {
        return dispatch({
          type: types.AUTH_ERROR,
          error: `User '${user.username}' Not Found`
        })
      }
      let loggedIn = bcrypt.compareSync(user.password, foundUser.hashed_password) ? user.username : false
      if (! loggedIn ) {
        return dispatch({
          type: types.AUTH_ERROR,
          error: `Incorrect password for '${user.username}'`
        })
      }
      dispatch({
        type: types.AUTH_LOGGED_IN,
        loggedIn: loggedIn
      })
      callback(loggedIn)
    })
  }
}

export function logout () {
  return { type: types.AUTH_LOG_OUT }
}
