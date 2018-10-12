import React from 'react'

import Toolbar from '@components/toolbar'
import HighlightedText from '@components/highlighted-text'
import InputField from '@components/input-field'
import TagField from '@components/tag-field'
import Button from '@components/buttons'
import './settings.scss'

export default class SettingsPage extends React.Component {
  state = {
    status: '',
    name: null,
    avatar: null,
    email: null,
    languages: null,
    password: null,
    passwordConfirm: null
  }

  constructor (props) {
    super(props)
    this.avatarUploadField = React.createRef()
  }

  static getDerivedStateFromProps (props, state) {
    return {
      name: state.name != null ? state.name : props.profile.name,
      avatar: state.avatar != null ? state.avatar : props.profile.avatar,
      email: state.email != null ? state.email : props.profile.email,
      languages:
        state.languages != null ? state.languages : props.profile.languages
    }
  }

  render () {
    return (
      <div className="settings">
        <Toolbar
          title="Edit Profile"
          rightComponent={
            <span
              className="settings-toolbar-done-link"
              onClick={() => this.saveProfile()}
            >
              Done
            </span>
          }
          backArrowClassName='settings-toolbar-back-link'
          onBack={this.props.back}
        />

        <section className="settings-form">
          <HighlightedText
            text={this.state.status}
            className="settings-form-status"
            textClassName="settings-form-status-text"
          />
          <div className="settings-form-row">
            <span className="settings-form-row-label">Name</span>
            <InputField
              key="name-field"
              className="settings-form-row-input"
              placeholder="Name"
              type="text"
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value })}
            />
          </div>

          <div className="settings-form-row">
            <span className="settings-form-row-label">Email</span>
            <InputField
              key="email-field"
              className="settings-form-row-input"
              placeholder="Email"
              type="email"
              value={this.state.email}
              onChange={event => this.setState({ email: event.target.value })}
            />
          </div>

          <div className="settings-form-row">
            <span className="settings-form-row-label">Languages</span>
            <TagField
              key="languages-field"
              className="settings-form-row-input"
              placeholder="Enter your languages"
              tags={this.state.languages}
              onChange={languages => this.setState({ languages })}
              suggestions={[
                { id: 'EN', text: 'English' },
                { id: 'ES', text: 'Spanish' },
                { id: 'FR', text: 'French' },
                { id: 'RU', text: 'Russian' }
              ]}
            />
          </div>

          <div className="settings-form-row">
            <span className="settings-form-row-label">New Password</span>
            <InputField
              key="password-field"
              className="settings-form-row-input"
              placeholder="New Password"
              type="password"
              value={this.state.password}
              onChange={event =>
                this.setState({ password: event.target.value })
              }
            />
          </div>

          <div className="settings-form-row">
            <span className="settings-form-row-label">Confirm Password</span>
            <InputField
              key="password-confirm-field"
              className="settings-form-row-input"
              placeholder="Confirm New Password"
              type="password"
              value={this.state.passwordConfirm}
              onChange={event =>
                this.setState({ passwordConfirm: event.target.value })
              }
            />
          </div>

          <input
            ref={this.avatarUploadField}
            id="file-input"
            type="file"
            name="avatar"
            style={{ display: 'none' }}
            accept="image/*"
            onClick={event => {
              event.target.value = null
            }}
            onInput={event => this.handleFileUpload(event)}
          />
        </section>

        <Button
          className='settings-logout-button'
          label='Log Out'
          onClick={this.props.logout} />

        <footer className='settings-footer'>
          <div className='settings-footer-inner'>
            <a href={this.props.legalUrl} className='settings-footer-inner-link'>Legal</a>
            <a href={this.props.privacyUrl} className='settings-footer-inner-link'>Privacy</a>
            <a href={this.props.cookiesUrl} className='settings-footer-inner-link'>Cookies</a>
          </div>
        </footer>

      </div>
    )
  }

  handleFileUpload = event => {
    const file = event.target.files[0]
    this.setState({ avatarUpload: file })
    const reader = new FileReader()
    reader.onload = event => {
      this.setState({ avatar: event.target.result })
    }
    reader.readAsDataURL(file)
  }

  saveProfile () {
    const {
      name,
      email,
      avatar,
      avatarUpload,
      languages,
      password,
      passwordConfirm
    } = this.state
    let profile = { avatar }

    if (name) {
      profile.name = name
    } else {
      return this.setStatus(STATUS.invalidName)
    }

    if (email) {
      profile.email = email
    } else {
      return this.setStatus(STATUS.invalidEmail)
    }

    if (languages.length > 0) {
      profile.languages = languages
    } else {
      return this.setStatus(STATUS.invalidLanguagesCount)
    }

    if (password && passwordConfirm) {
      if (password === passwordConfirm) {
        profile.password = password
      } else {
        return this.setStatus(STATUS.incorrectConfirm)
      }
    }

    if (avatarUpload) {
      // TODO: PUSH TO SERVER
    }

    this.props.saveProfile(profile)
    return this.setStatus(STATUS.saved)
  }

  setStatus = reason => this.setState({ status: reason })
}

const STATUS = {
  saved: 'Great! Your profile was updated.',
  invalidName: "Pardon, You don't have a name?",
  invalidEmail: "Awesome! and what's your email address?",
  invalidPassConfirm: "Oops! Your passwords don't match.",
  invalidLanguagesCount: 'Sorry! You need to know at least one language.'
}
