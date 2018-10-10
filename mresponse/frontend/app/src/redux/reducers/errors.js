import { LOGIN_ERROR } from '@redux/actions'

const initial = {
  loginError: null
}

export default (state = initial, action) => {
  switch (action.type) {
    case LOGIN_ERROR:
      const { error } = action
      return Object.assign({}, state, {
        loginError: error
      })

    default:
      return state
  }
}
