import React from 'react'
import { Route, withRouter } from 'react-router-dom'

import './login.scss'
import { FORGOT_PASSWORD_URL, LOGIN_URL, SIGNUP_URL } from '@utils/urls'
import LoginForm from '@components/login-form'
import SignupForm from '@components/signup-form'
import ForgotPasswordForm from '@components/forgot-password-form'

class LoginPage extends React.Component {
  constructor (props) {
    super(props)
    this.signupForm = React.createRef()
  }

  render () {
    return (
      <div className="login-page">
        <header className="toolbar">
          <img
            className="toolbar-back-icon"
            src={this.props.icon || '/static/media/icons/back-chevron.svg'}
            onClick={() => this.goBack()}
            alt=""
          />
          <img
            className="toolbar-logo"
            src="/static/media/mozilla-logo.png"
            alt=""
          />
          <span
            onClick={() => this.toggleRoute()}
            className="toolbar-login-link"
          >
            {this.props.location.pathname === LOGIN_URL ? 'Signup' : 'Login'}
          </span>
        </header>

        <section className="login-page-content">
          <Route
            path={LOGIN_URL}
            component={() => (
              <LoginForm
                login={this.props.login}
                status={this.props.status}
                forgotPassword={() =>
                  this.props.history.push(FORGOT_PASSWORD_URL)
                }
              />
            )}
          />
          <Route
            path={SIGNUP_URL}
            component={() => (
              <SignupForm
                ref={this.signupForm}
                status={this.props.status}
                createAccount={this.props.createAccount}
              />
            )}
          />
          <Route
            path={FORGOT_PASSWORD_URL}
            component={() => (
              <ForgotPasswordForm resetPassword={this.props.forgotPassword} />
            )}
          />
        </section>
      </div>
    )
  }

  toggleRoute = () => {
    const { pathname } = this.props.location
    if (pathname === LOGIN_URL) {
      this.props.history.push(SIGNUP_URL)
    } else {
      this.props.history.push(LOGIN_URL)
    }
  }

  goBack = () => {
    if (this.props.location.pathname === SIGNUP_URL) {
      const canGoBack = this.signupForm.current.goBack()
      if (!canGoBack) {
        this.props.history.push(LOGIN_URL)
      }
    } else if (this.props.location.pathname === FORGOT_PASSWORD_URL) {
      this.props.history.push(LOGIN_URL)
    } else {
      this.props.back()
    }
  }
}

export default withRouter(LoginPage)
