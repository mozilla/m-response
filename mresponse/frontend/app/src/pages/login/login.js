import React from 'react'
import { withRouter } from 'react-router-dom'

import './login.scss'
import { FORGOT_PASSWORD_URL, LOGIN_URL, SIGNUP_URL, staticAsset } from '@utils/urls'
import SignupForm from '@components/signup-form'
import { DASHBOARD_URL } from '../../utils/urls'

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
            src={staticAsset('media/icons/arrow-left.svg')}
            className={`toolbar-back`}
            onClick={this.goBack}
            alt='' />
          <img
            className="toolbar-logo"
            src={staticAsset('media/mozilla-logo.png')}
            alt=""
          />
          <span />
        </header>

        <section className="login-page-content">
          <SignupForm
            ref={this.signupForm}
            status={this.props.status}
            supportedLanguages={this.props.supportedLanguages}
            updateProfile={this.props.updateProfile}
            successUrl={DASHBOARD_URL}
            history={this.props.history}
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
