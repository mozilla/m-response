import { push } from 'connected-react-router'
import { LOGIN_URL, DASHBOARD_URL, LOGOUT_URL } from '@utils/urls'
import Auth from '@utils/auth'

const auth = new Auth()

export const LOGIN_ATTEMPT = 'LOGIN_ATTEMPT'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_ERROR = 'LOGIN_ERROR'
export const LOGIN_RESET = 'LOGIN_RESET'
export const LOGOUT = 'LOGOUT'

export const loginAttempt = (username, password) => {
  return {
    type: LOGIN_ATTEMPT,
    credentials: {
      username,
      password
    }
  }
}

export const loginSuccess = (profile, token, expiresAt) => {
  return {
    type: LOGIN_SUCCESS,
    profile,
    token,
    expiresAt
  }
}

export const loginError = error => dispatch => {
  console.log(error)
  dispatch({
    type: LOGIN_ERROR,
    error
  })
}

export const login = (username, password) => async dispatch => {
  try {
    await auth.login(username, password)
    return dispatch(loginAttempt(username, password))
  } catch (err) {
    return dispatch(loginError(err))
  }
}

export const logout = () => dispatch => {
  auth.logout(window.location.origin + LOGOUT_URL)
  return dispatch({ type: 'test' })
}

export const signup = ({ email, password, name, languages }) => async dispatch => {
  try {
    await auth.signup(email, password, name, languages)
    return dispatch(login(email, password))
  } catch (err) {
    return dispatch(loginError(err))
  }
}

export const forgetPassword = email => async dispatch => {
  try {
    await auth.changePassword(email)
    return dispatch({
      type: LOGIN_RESET,
      email
    })
  } catch (err) {
    return dispatch(loginError(err))
  }
}

export const loginCallback = () => async dispatch => {
  try {
    const authResult = await auth.parseHash()
    const expiresAt = Date.now() + (authResult.expiresIn * 1000)
    dispatch(loginSuccess(authResult.idTokenPayload, authResult.idToken, expiresAt))
    return dispatch(push(DASHBOARD_URL))
  } catch (err) {
    dispatch(loginError(err))
    return dispatch(push(LOGIN_URL))
  }
}

export const logoutCallback = () => dispatch => {
  dispatch({ type: LOGOUT })
  return dispatch(push(LOGIN_URL))
}
