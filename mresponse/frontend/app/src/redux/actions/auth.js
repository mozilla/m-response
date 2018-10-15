import { push } from 'connected-react-router'
import { LOGIN_URL, DASHBOARD_URL, LOGOUT_URL } from '@utils/urls'
import Auth from '@utils/auth'
import Api from '@utils/mock-api'

const auth = new Auth()
const api = new Api()

export const LOGIN_ATTEMPT = 'LOGIN_ATTEMPT'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_ERROR = 'LOGIN_ERROR'
export const LOGIN_RESET = 'LOGIN_RESET'
export const LOGOUT = 'LOGOUT'
export const SET_PROFILE = 'SET_PROFILE'
export const UPDATE_EXTRA_USER_META = 'UPDATE_EXTRA_USER_META'

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
  const { description, policy } = error
  return dispatch({
    type: LOGIN_ERROR,
    error: policy || description
  })
}

export const login = (username, password) => async dispatch => {
  try {
    await auth.login(username, password)
    return dispatch(loginAttempt(username, password))
  } catch (err) {
    dispatch(loginError(err))
    return dispatch(push(LOGIN_URL))
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
    dispatch(loginError(err))
    return dispatch(push(LOGIN_URL))
  }
}

export const updateProfile = ({ name, languages }) => async (dispatch, getState) => {
  try {
    const { token, profile } = getState().auth
    const metadata = {}
    if (name) {
      metadata.name = name
    }
    if (languages) {
      metadata.languages = JSON.stringify(languages)
    }
    if (metadata.name || metadata.languages) {
      const updatedProfile = await auth.updateUserMetadata(profile.user_id, token, metadata)
      return dispatch({
        type: SET_PROFILE,
        profile: updatedProfile
      })
    }
  } catch (err) {
    return dispatch(loginError(err))
  }
}

export const loginCallback = () => async dispatch => {
  try {
    const authResult = await auth.parseHash()
    const expiresAt = Date.now() + (authResult.expiresIn * 1000)
    const profile = await auth.getUser(authResult.accessToken, authResult.idTokenPayload.sub)
    dispatch(loginSuccess(profile, authResult.accessToken, expiresAt))
    dispatch(fetchExtraUserMeta())
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

export const updateExtraUserMeta = meta => ({
  type: UPDATE_EXTRA_USER_META,
  meta
})

export const fetchExtraUserMeta = () => async (dispatch) => {
  try {
    const meta = await api.getExtraUserMeta()
    return dispatch(updateExtraUserMeta(meta))
  } catch (err) {
    console.error(err)
    return dispatch(loginError(err))
  }
}