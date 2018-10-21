import React from 'react'

import './signup-form.scss'
import InputField from '@components/input-field'
import TagField from '@components/tag-field'
import HighlightedText from '@components/highlighted-text'
import Button from '@components/buttons'

export default class SignUpForm extends React.Component {
  status = {
    name: "Welcome! What's your name?",
    email: 'Almost done! Enter your email and create a password.',
    password: 'Cool! and what password would you like to use?',
    passwordConfirm: 'Nearly There! Enter the password again.',
    incorrectConfirm: "Oops! Your passwords don't match",
    passwordTooShort: 'Oops! Your password must be at least 8 characters long',
    passwordNoLetter: 'Oops! Your password must contain at least one letter',
    passwordNoNumber: 'Oops! Your password must contain at least one number',
    invalidLanguagesCount: 'Sorry! You need to know at least one language.',
    languages:
      'Nice! What language(s) can you read and write?'
  }

  state = {
    status: this.props.status || this.status.name,
    step: 0,
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    languages: []
  }

  render () {
    const {
      subtitle,
      fields,
      canContinue,
      validate,
      buttonText,
      buttonPress
    } = this.getStep()
    const onSubmit = event => {
      event.preventDefault()
      if (validate()) {
        if (buttonPress != null) {
          buttonPress()
        } else {
          this.proceed()
        }
      }
    }
    return (
      <div className="signup-form">
        <h2 className="signup-form-title">Sign Up</h2>
        <span className="signup-form-subtitle">{subtitle}</span>

        <HighlightedText
          text={this.state.status}
          className="signup-form-status"
          textClassName="signup-form-status-text"
        />
        <form className="signup-form-fields" onSubmit={e => onSubmit(e)}>
          {fields}
          <Button
            label={buttonText}
            className="signup-form-submit"
            onClick={e => onSubmit(e)}
            disabled={canContinue}
          />
        </form>
      </div>
    )
  }

  getStep = () =>
    [
      {
        prepare: () => this.setStatus(this.status.name),
        subtitle: '1 of 3',
        fields: (
          <React.Fragment>
            <InputField
              key="name-field"
              className="signup-form-field"
              placeholder="Name"
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value })}
            />
          </React.Fragment>
        ),
        canContinue: !this.state.name,
        validate: () => true,
        buttonText: 'Next'
      },
      {
        prepare: () => this.setStatus(this.status.languages),
        subtitle: '2 of 3',
        fields: (
          <React.Fragment>
            <TagField
              className="signup-form-field"
              placeholder="Language"
              suggestions={this.props.supportedLanguages || []}
              onChange={languages => this.setState({ languages })}
            />
          </React.Fragment>
        ),
        canContinue: false,
        validate: () => {
          if (this.state.languages.length > 0) {
            return true
          } else {
            this.setStatus(this.status.invalidLanguagesCount)
            return false
          }
        },
        buttonText: 'Next'
      },
      {
        prepare: () => this.setStatus(this.status.email),
        subtitle: '3 of 3',
        fields: (
          <React.Fragment>
            <InputField
              key="email-field"
              className="signup-form-field"
              placeholder="Email"
              type="email"
              value={this.state.email}
              onChange={event => this.setState({ email: event.target.value })}
              onFocus={() => this.setStatus(this.status.email)}
            />
            <InputField
              key="password-field"
              className="signup-form-field"
              placeholder="Password"
              type="password"
              onChange={event =>
                this.setState({ password: event.target.value })
              }
              onFocus={() => this.setStatus(this.status.password)}
              disabled={!this.state.email.length}
            />
            <InputField
              key="password-confirm-field"
              className="signup-form-field"
              placeholder="Confirm Password"
              type="password"
              onChange={event =>
                this.setState({ passwordConfirm: event.target.value })
              }
              onFocus={() => this.setStatus(this.status.passwordConfirm)}
              disabled={!this.state.password.length}
            />
          </React.Fragment>
        ),
        canContinue: !(
          this.state.email &&
          this.state.password &&
          this.state.passwordConfirm
        ),
        validate: () => {
          // Validate password strength
          if (this.state.password.length < 8) {
            this.setStatus(this.status.passwordTooShort)
            return false
          }

          let passwordHasLetter = false
          let passwordHasNumber = false

          for (let char of this.state.password) {
            if (char.match(/[a-z]/i)) {
              passwordHasLetter = true
            }
            if (char.match(/[0-9]/i)) {
              passwordHasNumber = true
            }
          }

          if (!passwordHasLetter) {
            this.setStatus(this.status.passwordNoLetter)
            return false
          }

          if (!passwordHasNumber) {
            this.setStatus(this.status.passwordNoNumber)
            return false
          }

          // Validate passwords match
          if (this.state.password !== this.state.passwordConfirm) {
            this.setStatus(this.status.incorrectConfirm)
            return false
          }

          return true
        },
        buttonText: 'Finish',
        buttonPress: () =>
          this.props.createAccount({
            email: this.state.email,
            name: this.state.name,
            password: this.state.password,
            languages: this.state.languages.map(({ id }) => id)
          })
      }
    ][this.state.step]

  setStatus = status => this.setState({ status })

  proceed = () => {
    this.setState({ step: this.state.step + 1 }, () => this.getStep().prepare())
  }

  goBack = () => {
    if (this.state.step > 0) {
      this.setState({ step: this.state.step - 1 }, () =>
        this.getStep().prepare()
      )
      return true
    } else {
      return false
    }
  }
}
