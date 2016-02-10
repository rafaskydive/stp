import * as types from '../constants'

const initialState = {
  loggedIn: false,
  user: {
    username: 'doppler',
    password: 'doppler'
  }
}

export default function auth (state=initialState, action) {
  switch (action.type) {
    case types.EDIT_AUTH_FIELD:
      let { user } = {...state}
      user[action.payload.field] = action.payload.value
      return Object.assign({}, state, {
        user: user
      })

    case types.AUTH_LOGGED_IN:
      return Object.assign({}, state, {
        loggedIn: action.loggedIn
      })

    case types.AUTH_LOG_OUT:
      return Object.assign({}, state, {
        loggedIn: false
      })
      
    default:
      return state
  }
}
