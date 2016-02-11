import * as types from '../constants/authConstants'

const initialState = {
  loggedIn: false,
  error: null,
  user: {
    username: '',
    password: ''
  }
}

export default function auth (state=initialState, action) {
  switch (action.type) {
    case types.AUTH_EDIT_FIELD:
      let { user } = {...state}
      user[action.payload.field] = action.payload.value
      return Object.assign({}, state, {
        user: user
      })

    case types.AUTH_LOGGED_IN:
      return Object.assign({}, state, {
        loggedIn: action.loggedIn
      })

    case types.AUTH_ERROR:
      return Object.assign({}, state, {
        error: action.error
      })

    case types.AUTH_LOG_OUT:
      return Object.assign({}, state, {
        loggedIn: false,
        error: null,
        user: {username:'',password:''}
      })

    default:
      return state
  }
}
