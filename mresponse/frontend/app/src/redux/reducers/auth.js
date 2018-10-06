import { LOGIN_SUCCESS, LOGOUT } from '@redux/actions'

const initialState = {
  isAuthenticated: false,
  authError: null,
  token: null,
  profile: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      const { profile, token } = action
      return Object.assign({}, state, {
        token,
        profile,
        isAuthenticated: true
      })
    }

    case LOGOUT:
      return initialState

    default:
      return state
  }
}
