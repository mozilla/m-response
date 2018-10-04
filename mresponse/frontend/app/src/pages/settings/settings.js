import React from 'react'

import Toolbar from '@components/toolbar'
import Avatar from '@components/avatar'
import HighlightedText from '@components/highlighted-text'
import './settings.scss'
import InputField from '@components/input-field'
import TagField from '@components/tag-field'

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
    const { avatar, languages } = this.state
    return (
      <div className="settings">
        <Toolbar
          title="Edit Profile"
          titleBackground="white"
          rightComponent={
            <span
              className="settings-toolbar-logout-link"
              onClick={() => this.props.logout()}
            >
              Logout
            </span>
          }
          leftComponent={
            <img
              className="settings-toolbar-back-link"
              src="/static/media/icons/back-chevron.svg"
              onClick={() => this.props.back()}
              alt=""
            />
          }
        />

        <section className="settings-user-meta">
          <span
            className="settings-edit-button"
            onClick={() => this.saveProfile()}
          >
            Done
          </span>

          <div className="settings-avatar">
            <Avatar
              editable={true}
              src={avatar}
              onClick={() => this.avatarUploadField.current.click()}
            />
          </div>

          <span className="settings-name">{this.state.name}</span>
        </section>

        <section className="settings-languages">
          {languages.map(({ text }) => (
            <span className="settings-languages-tag">{text}</span>
          ))}
        </section>

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
              icon="/static/media/icons/user.svg"
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
