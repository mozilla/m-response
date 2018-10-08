import React from 'react'
import PropTypes from 'prop-types'

import './login-form.scss'
import InputField from '@components/input-field'
import HighlightedText from '@components/highlighted-text'
import Button from '@components/buttons'

export default class LoginForm extends React.Component {
  state = { status: this.props.status || "What's your email address?", email: '', password: '' }

  render () {
    return (
      <div className="login-form">
        <h2 className="login-form-title">Sign In</h2>
        <HighlightedText
          text={this.state.status}
          className="login-form-status"
          textClassName="login-form-status-text"
        />

        <form
          className="login-form-fields"
          onSubmit={event => this.submit(event)}
        >
          <InputField
            className="login-form-field"
            placeholder="Email"
            type="email"
            onChange={event => this.setEmail(event)}
            // onFocus={() => this.setStatus("What's your email address?")}
          />
          <InputField
            className="login-form-field"
            placeholder="Password"
            type="password"
            onChange={event => this.setPassword(event)}
            // onFocus={() => this.setStatus("What's your password?")}
            disabled={!this.state.email.length}
          />
          <span
            className="login-form-forgot-link"
            onClick={event => this.forgot(event)}
          >
            Forgot your password?
          </span>
          <Button
            label="Login"
            className="login-form-submit"
            disabled={!(this.state.email && this.state.password)}
          />
          <span className="login-form-signup">
            Don't have an account yet?{' '}
            <span onClick={() => this.props.goToSignup()} className="login-form-signup-link">
              Register
            </span>
          </span>
        </form>
      </div>
    )
  }

  setEmail = event => {
    this.setState({ email: event.target.value })
  }

  setPassword = event => this.setState({ password: event.target.value })

  setStatus = status => this.setState({ status })

  submit = event => {
    event.preventDefault()
    // DO VALIDATION HERE!!
    this.props.login(this.state.email, this.state.password)
  }

  forgot = event => {
    event.preventDefault()
    this.props.forgotPassword()
  }
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
  forgotPassword: PropTypes.func.isRequired,
  goToSignup: PropTypes.func.isRequired
}
