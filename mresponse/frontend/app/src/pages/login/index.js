import React from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import qs from 'query-string'

import { LOGIN_URL, SIGNUP_URL } from '@utils/urls'
import { login, signup, forgetPassword } from '@redux/actions'
import LoginPage from './login'

const mapStateToProps = state => {
  const status = state.errors.loginError
  return {
    status: status ? `Error: ${status}` : null
  }
}
const mapDispatchToProps = (dispatch, props) => ({
  back: () => dispatch(push('/')),
  login: (email, password) => dispatch(login(email, password)),
  createAccount: account => dispatch(signup(account)),
  forgotPassword: email => dispatch(forgetPassword(email))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)