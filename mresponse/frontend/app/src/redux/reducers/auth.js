import { LOGIN_SUCCESS, LOGOUT, SET_PROFILE, UPDATE_EXTRA_USER_META } from '@redux/actions'

const initialState = {
  isAuthenticated: false,
  authError: null,
  token: null,
  profile: null,
  extraUserMeta: {},
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
    
    case UPDATE_EXTRA_USER_META: {
      const { meta } = action
      return Object.assign({}, state, {
        extraUserMeta: meta
      })
    }

    default:
      return state
  }
}
