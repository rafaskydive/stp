import * as types from '../constants'
import database from '../database'
import bcrypt from 'bcrypt-nodejs'

const users = {
  "stp": {
    hashed_password: "$2a$10$b6cgfiN7YxK3RaCIc7tWVeMfuFNDqe6z7gHhyaXegq8w03EQdwMka"
  }
}

export function editField (target) {
  return {
    type: types.EDIT_AUTH_FIELD,
    payload: { field: target.name, value: target.value }
  }
}

export function login (user, callback) {
  return dispatch => {
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
  }
}

export function logout () {
  return { type: types.AUTH_LOG_OUT }
}
