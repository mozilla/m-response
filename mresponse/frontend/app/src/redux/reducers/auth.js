import { LOGIN_SUCCESS, LOGIN_ERROR } from '@redux/actions'

const initialState = {
  isAuthenticated: false,
  authError: null,
  token: null,
  profile: null
}

export default (state=initialState, action) => {
  switch(action.type) {

    case LOGIN_SUCCESS: {
      const { profile, token } = action
      return Object.assign({}, state, {
        token,
        profile,
        isAuthenticated: true
      })
    }

    default:
      return state

  }
}