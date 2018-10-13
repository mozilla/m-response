import React from 'react'
import PropTypes from 'prop-types'

import Toolbar from '@components/toolbar'
import Avatar from '@components/avatar'
import ProgressBar from '@components/progress-bar'
// import ResponseCard from '@components/response-card'
import Button from '@components/buttons'
import { staticAsset } from '@utils/urls'

import './profile.scss'

export default class ProfilePage extends React.Component {
  render() {
    const {
      profile: {
        name,
        picture,
        karma,
        languages
      },
      editProfile
    } = this.props
    const totalKarma = karma ? karma.responses.karmaValue + karma.moderations.karmaValue : 0
    return (
      <div className="profile">

        <Toolbar
          className='profile-toolbar'
          titleClassName='profile-toolbar-title'
          title="Profile"
          onBack={this.props.back}
        />

        <section className='profile-header'>
          <div className='profile-header-container'>
            <div className="profile-header-avatar">
              <Avatar src={picture || ''} />
            </div>

            <div className="profile-header-meta">
              <span className="profile-header-meta-name">{name || ''}</span>

              <span className="profile-header-meta-languages">
                <img
                  src={staticAsset('media/icons/globe.svg')}
                  className='profile-header-meta-languages-icon'
                  alt='' />
                {languages.map(({ text }, index) =>
                  (index !== languages.length - 1)
                    ? text + ', '
                    : text
                )}
              </span>
            </div>
          </div>

          <div className="profile-header-karma">
            <div className='profile-header-karma-group'>
              <span className='profile-header-karma-group-value'>{karma ? karma.responses.responsesCount : 0}</span>
              <span className='profile-header-karma-group-label'>Responses</span>
            </div>
            <span className='profile-header-karma-seperator'>|</span>
            <div className='profile-header-karma-group'>
              <span className='profile-header-karma-group-value'>{karma ? karma.moderations.moderations : 0}</span>
              <span className='profile-header-karma-group-label'>Moderations</span>
            </div>
            <span className='profile-header-karma-seperator'>|</span>
            <div className='profile-header-karma-group'>
              <span className='profile-header-karma-group-value'>{totalKarma}</span>
              <span className='profile-header-karma-group-label'>Karma</span>
            </div>
          </div>

        </section>

        {/* <section className="profile-awesome-progress">
          <span className="profile-awesome-progress-title">Unlock Awesome Mode</span>
          <ProgressBar
            className='profile-awesome-progress-bar'
            value={totalKarma}
            maxValue={10000} />
        </section> */}

        <Button
          className='profile-edit-button'
          label='Settings'
          onClick={editProfile} />

        {/* <section className="profile-response-history">
          <div className="profile-response-history-header">
            <span className="profile-response-history-header-title">Response History</span>
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
        </section> */}

      </div>
    )
  }
}

ProfilePage.propTypes = {
  profile: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired,
  editProfile: PropTypes.func.isRequired,

}
