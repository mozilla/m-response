import React from 'react'
import PropTypes from 'prop-types'

import Toolbar from '../../components/toolbar'
import Avatar from '../../components/avatar'
import HighlightedText from '../../components/highlighted-text'
import './profile.scss'

export default class ProfilePage extends React.Component {
  render () {
    const {
      profile: { name, avatar, karma }
    } = this.props
    return (
      <div className="profile">
        <Toolbar
          title="Your Profile"
          titleBackground="white"
          leftComponent={
            <span
              className="profile-toolbar-logout-link"
              onClick={() => this.props.logout()}
            >
              Logout
            </span>
          }
          rightComponent={
            <img
              className="profile-toolbar-back-link"
              src="/static/media/icons/back-chevron.svg"
              onClick={() => this.props.back()}
            />
          }
        />

        <section className="profile-user-meta">
          <span
            className="profile-edit-button"
            onClick={() => this.props.editProfile()}
          >
            Edit
          </span>

          <div className="profile-avatar">
            <Avatar src={avatar}/>
          </div>

          <HighlightedText textClassName="profile-name" text={name}/>
        </section>

        <section className="profile-karma">
          <section className="profile-karma-box profile-karma-box--left">
            <HighlightedText
              textClassName="profile-karma-box-header"
              text="R."
            />

            <div className="profile-karma-box-amount">
              <span className="profile-karma-box-amount-value">
                +{karma.responses.karmaValue}
              </span>
              <span className="profile-karma-box-amount-label">
                Karma Received
              </span>
            </div>

            <div className="profile-karma-box-responses">
              <span className="profile-karma-box-responses-value">
                {karma.responses.responseCount}
              </span>
              <span className="profile-karma-box-responses-label">
                Number of Responses Completed
              </span>
            </div>
          </section>

          <section className="profile-karma-box profile-karma-box--right">
            <HighlightedText
              textClassName="profile-karma-box-header"
              text="M."
            />

            <div className="profile-karma-box-amount">
              <span className="profile-karma-box-amount-value">
                +{karma.moderations.karmaValue}
              </span>
              <span className="profile-karma-box-amount-label">
                Karma Given
              </span>
            </div>

            <div className="profile-karma-box-responses">
              <span className="profile-karma-box-responses-value">
                {karma.responses.moderationsCount}
              </span>
              <span className="profile-karma-box-responses-label">
                Number of Moderations Completed
              </span>
            </div>
          </section>
        </section>
      </div>
    )
  }
}

ProfilePage.propTypes = {
  profile: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired,
  editProfile: PropTypes.func.isRequired
}
