import React from 'react'

import Toolbar from '@components/toolbar'
import Avatar from '@components/avatar'
import HighlightedText from '@components/highlighted-text'
import './settings.scss'
import InputField from '@components/input-field'
import TagField from '@components/tag-field'

export default class SettingsPage extends React.Component {
  state = {
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
    const { name, avatar, languages } = this.state
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
              src="static/media/icons/back-chevron.svg"
              onClick={() => this.props.back()}
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
            className="signup-form-status"
            textClassName="signup-form-status-text"
          />
          <div className="settings-form-row">
            <span className="settings-form-row-label">Name</span>
            <InputField
              key="name-field"
              className="settings-form-row-input"
              placeholder="Name"
              icon="static/media/icons/user.svg"
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
    let profile = { name, email, avatar }

    console.log(this.state)
    if (languages.length > 0) {
      profile.languages = languages
    } else {
      alert('Need to know at least 1 language')
      throw 'Passwords do not match'
    }

    if (password && passwordConfirm) {
      if (password === passwordConfirm) {
        profile.password = password
      } else {
        alert('Passwords do not match')
        throw 'Passwords do not match'
      }
    }

    if (avatarUpload) {
      // TODO: PUSH TO SERVER
    }

    this.props.saveProfile(profile)
  }
}
