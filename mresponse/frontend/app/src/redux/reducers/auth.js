import { LOGIN_SUCCESS, LOGOUT, SET_PROFILE } from '@redux/actions'

const initialState = {
  isAuthenticated: false,
  authError: null,
  token: null,
  profile: null,
  expiresAt: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      const { profile, token, expiresAt } = action
      return Object.assign({}, state, {
        token,
        profile,
        expiresAt,
        isAuthenticated: true
      })
    }

    case LOGOUT:
      return initialState

    case SET_PROFILE: {
      const { profile } = action
      return Object.assign({}, state, {
        profile
      })
    }

    default:
      return state
  }
}
