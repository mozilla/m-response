import React from 'react'

import { BACKEND_LOGOUT_URL } from '@utils/urls'
import Toolbar from '@components/toolbar'
import HighlightedText from '@components/highlighted-text'
import InputField from '@components/input-field'
import TagField from '@components/tag-field'
import Button from '@components/buttons'
import './settings.scss'

export default class SettingsPage extends React.Component {
  constructor (props) {
    super(props)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogout () {
    this.props.logout()
    window.location.replace(BACKEND_LOGOUT_URL)
  }

  state = {
    status: '',
    name: this.props.profile.name || '',
    email: this.props.profile.email || '',
    languages: this.props.profile.languages || []
  }

  render () {
    return (
      <div className="settings">
        <div className="settings-content">
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
                disabled={true}
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
                suggestions={this.props.supportedLanguages || []}
              />
            </div>
          </section>
        </div>

        <footer className='settings-footer'>
          <Button
            className='settings-logout-button'
            label='Log Out'
            onClick={this.handleLogout} />
          <div className='settings-footer-inner'>
            <a target='_blank' href={this.props.legalUrl} className='settings-footer-inner-link'>Legal</a>
            <a target='_blank' href={this.props.privacyUrl} className='settings-footer-inner-link'>Privacy</a>
            <a target='_blank' href={this.props.cookiesUrl} className='settings-footer-inner-link'>Cookies</a>
          </div>
        </footer>

      </div>
    )
  }

  // handleFileUpload = event => {
  //   const file = event.target.files[0]
  //   this.setState({ pictureUpload: file })
  //   const reader = new FileReader()
  //   reader.onload = event => {
  //     this.setState({ picture: event.target.result })
  //   }
  //   reader.readAsDataURL(file)
  // }

  saveProfile () {
    const {
      name,
      email,
      picture,
      languages
    } = this.state
    let profile = { picture }

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
      profile.languages = languages.map(({ id }) => id)
    } else {
      return this.setStatus(STATUS.invalidLanguagesCount)
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
  invalidLanguagesCount: 'Sorry! You need to know at least one language.'
}
