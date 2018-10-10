import React from 'react'

import './signup-form.scss'
import InputField from '@components/input-field'
import TagField from '@components/tag-field'
import HighlightedText from '@components/highlighted-text'
import Button from '@components/buttons'

export default class SignUpForm extends React.Component {
  status = {
    name: "Welcome! What's your name?",
    email: "Awesome! and what's your email address?",
    password: 'Cool! and what password would you like to use?',
    passwordConfirm: 'Nearly There! Enter the password again.',
    incorrectConfirm: "Oops! Your passwords don't match",
    languages:
      'Nice! Now, What language(s) can communicate in, or rather respond best in?'
  }

  state = {
    status: this.props.status || this.status.name,
    step: 0,
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    languages: [],
    supportedLanguages: [
      { id: 'English', text: 'English' },
      { id: 'Spanish', text: 'Spanish' },
      { id: 'French', text: 'French' },
      { id: 'Russian', text: 'Russian' },
      { id: 'Latin', text: 'Latin' }
    ]
  }

  render () {
    const {
      title,
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
        <h2 className="signup-form-title">{title}</h2>
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
        title: 'Signup - Step 1/3',
        fields: (
          <React.Fragment>
            <InputField
              key="name-field"
              className="signup-form-field"
              placeholder="Name"
              icon="/static/media/icons/user.svg"
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
        title: 'Signup - Step 2/3',
        fields: (
          <React.Fragment>
            <TagField
              className="signup-form-field"
              placeholder="Enter your languages"
              icon="/static/media/icons/message.svg"
              suggestions={this.state.supportedLanguages}
              onChange={languages => this.setState({ languages })}
            />
          </React.Fragment>
        ),
        canContinue: false,
        validate: () => true,
        buttonText: 'Next'
      },
      {
        prepare: () => this.setStatus(this.status.email),
        title: 'Signup - Step 3/3',
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
          if (this.state.password === this.state.passwordConfirm) {
            return true
          } else {
            this.setStatus(this.status.incorrectConfirm)
            return false
          }
        },
        buttonText: 'Create Account',
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
