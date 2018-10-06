import auth0 from 'auth0-js'
import { push } from 'connected-react-router'
import { LOGIN_URL } from '@utils/urls'

const connection = 'Username-Password-Authentication'

const domain = process.env.REACT_APP_AUTH_DOMAIN
const clientID = process.env.REACT_APP_AUTH_CLIENT_ID
const redirectUri = process.env.REACT_APP_AUTH_CALLBACK_URL

const auth = new auth0.WebAuth({
  domain,
  clientID,
  redirectUri,
  responseType: 'token id_token',
  scope: 'openid profile read:current_user',
  prompt: 'none'
})

export const LOGIN_ATTEMPT = 'LOGIN_ATTEMPT'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_ERROR = 'LOGIN_ERROR'
export const LOGIN_RESET = 'LOGIN_RESET'

export const loginAttempt = (username, password) => {
  return {
    type: LOGIN_ATTEMPT,
    credentials: {
      username,
      password
    }
  }
}

export const loginSuccess = (profile, token) => {
  return {
    type: LOGIN_SUCCESS,
    profile,
    token
  }
}

export const loginError = message => dispatch => {
  console.log(message)
  return dispatch({
    type: LOGIN_ERROR,
    message
  })
}

export const login = (username, password) => dispatch => {
  auth.login({
    username,
    password,
    realm: connection
  }, err => {
    if (err) {
      return dispatch(loginError(err))
    }
    return dispatch(loginAttempt(username, password))
  })
}

export const signup = ({email, password, name, langauges}) => (dispatch, getState) => {
  auth.signup({
    email,
    username: email,
    password,
    connection
  }, err => {
    if (err) {
      dispatch(loginError(err))
      return dispatch(push(LOGIN_URL))
    }
    dispatch(login(email, password))
    return dispatch(loginAttempt(email, password))
  })
}

export const forgetPassword = email => dispatch => {
  auth.changePassword({
    email,
    connection
  }, err => {
    if (err) {
      return dispatch(loginError(err))
    } else {
      return dispatch({
        type: LOGIN_RESET,
        email
      })
    }
  })
}

export const handleAuthentication = history => (dispatch, getState) =>
  auth.parseHash((err, authResult) => {
    if (err) {
      dispatch(push(LOGIN_URL))
      return loginError(err)
    }
    dispatch(loginSuccess(authResult.idTokenPayload, authResult.idToken))
    return dispatch(push('/dashboard'))
  })