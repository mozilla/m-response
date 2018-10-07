import React from 'react'
import PropTypes from 'prop-types'

import Toolbar from '@components/toolbar'
import Avatar from '@components/avatar'
import HighlightedText from '@components/highlighted-text'
import ProgressBar from '@components/progress-bar'
import ResponseCard from '@components/response-card'

import './profile.scss'

export default class ProfilePage extends React.Component {
  render() {
    const {
      profile: { name, avatar, karma, languages, responses }
    } = this.props
    const totalKarma = karma.responses.karmaValue + karma.moderations.karmaValue
    return (
      <div className="profile">
        <Toolbar
          title="Profile"
          titleBackground="white"
          leftComponent={
            <span
              className="profile-toolbar-back-link"
              onClick={() => this.props.back()}
            >
              Back
            </span>
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
            <Avatar src={avatar} />
          </div>

          <span className="profile-name">{name}</span>

          <div className="profile-languages">
            {languages.map(({ text }) => (
              <span className="profile-languages-tag">{text}</span>
            ))}
          </div>
        </section>

        <section className="profile-karma">
          <div className='profile-karma-group'>
            <span className='profile-karma-group-value'>{karma.responses.responsesCount}</span>
            <span className='profile-karma-group-label'>Responses</span>
          </div>
          <span className='profile-karma-seperator'>|</span>
          <div className='profile-karma-group'>
            <span className='profile-karma-group-value'>{karma.moderations.moderationsCount}</span>
            <span className='profile-karma-group-label'>Moderations</span>
          </div>
          <span className='profile-karma-seperator'>|</span>
          <div className='profile-karma-group'>
            <span className='profile-karma-group-value'>{totalKarma}</span>
            <span className='profile-karma-group-label'>Karma</span>
          </div>
        </section>

        <section className="profile-awesome-progress">
          <span className="profile-awesome-progress-title">Unlock Awesome Mode</span>
          <ProgressBar
            className='profile-awesome-progress-bar'
            value={totalKarma}
            maxValue={10000} />
        </section>

        <section className="profile-response-history">
          <div className="profile-response-history-header">
            <span className="profile-response-history-header-title">Response History</span>
            {/* <span className="profile-response-history-header-link">More</span> */}
          </div>
          <div className="profile-response-history-list">
            {responses.map(({ response, date, product }) => (
              <ResponseCard
                className="profile-response-history-list-card"
                response={response}
                date={date}
                productImage={product.image}
                productName={product.name} />
            ))}
          </div>
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
