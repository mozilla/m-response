import React from 'react'
import { Route, withRouter } from 'react-router-dom'

import './login.scss'
import { FORGOT_PASSWORD_URL, LOGIN_URL, SIGNUP_URL } from '@utils/urls'
import LoginForm from '@components/login-form'
import SignupForm from '@components/signup-form'
import ForgotPasswordForm from '@components/forgot-password-form'

class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.signupForm = React.createRef()
  }

  render() {
    return (
      <div className="login-page">
        <header className="toolbar">
          <span className="toolbar-back" onClick={this.goBack}>Back</span>
          <img
            className="toolbar-logo"
            src="/static/media/mozilla-logo.png"
            alt=""
          />
          <span />
        </header>

        <section className="login-page-content">
          <Route
            path={LOGIN_URL}
            component={() => (
              <LoginForm
                login={this.props.login}
                status={this.props.status}
                goToSignup={() => this.props.history.push(SIGNUP_URL)}
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
