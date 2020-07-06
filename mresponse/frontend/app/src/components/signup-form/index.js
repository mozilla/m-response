import React from 'react'

import './signup-form.scss'
import InputField from '@components/input-field'
import TagField from '@components/tag-field'
import HighlightedText from '@components/highlighted-text'
import Button from '@components/buttons'

export default class SignUpForm extends React.Component {
  status = {
    name: "Welcome! What's your name?",
    invalidLanguagesCount: 'Sorry! You need to know at least one language.',
    languages: 'Nice! What language(s) can you read and write?'
  }

  state = {
    status: this.props.status || this.status.name,
    step: 0,
    name: '',
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
        subtitle: '1 of 2',
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
        subtitle: '2 of 2',
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
        buttonText: 'Finish',
        buttonPress: () => {
          this.props.updateProfile({
            name: this.state.name,
            languages: this.state.languages.map(({ id }) => id)
          }).then(() => {
            this.props.history.push(this.props.successUrl)
          })
        }
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
