import { SET_PROFILE, UPDATE_EXTRA_USER_META, LOGOUT } from '@redux/actions'

const initialState = {
  isAuthenticated: false,
  profile: null,
  extraUserMeta: {},
  languages: '[]'
}
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILE: {
      const { profile } = action
      return Object.assign({}, state, profile)
    }
    case UPDATE_EXTRA_USER_META: {
      const { meta } = action
      return Object.assign({}, state, {
        extraUserMeta: meta
      })
    }
    case LOGOUT: {
      return initialState
    }
    default:
      return state
  }
}
