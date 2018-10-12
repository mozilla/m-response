import React from 'react'

import Avatar from '@components/avatar'
import HomePageCard from '@components/home-page-card'
import { staticAsset } from '@utils/urls'

import './home.scss'

export default class HomePage extends React.Component {
  componentWillMount () {
    this.props.updateAppConfig()
    this.props.updateHomeConfig()
  }

  render () {
    const {
      profile,
      feedbackLink,
      aboutLink,
      goToProfile,
      respondQueue,
      moderateQueue,
      goToRespondMode,
      goToModerateMode
    } = this.props
    this.props.updateHomeConfig()
    return (
      <div className='home-page'>
        <header className='home-page-header'>
          <img
            className='home-page-header-logo'
            src={staticAsset('media/mozilla-logo-white.png')}
            alt='' />
          <Avatar
            className='home-page-header-avatar'
            src={profile.picture}
            karma={0}
            coverIcon={staticAsset('media/icons/user.svg')}
            onClick={goToProfile} />
        </header>

        <section className='home-page-content'>
          <HomePageCard
            dotColor='#FF4D1C'
            icon={staticAsset('media/icons/respond.svg')}
            title='Respond'
            subtitle={`Queue: ${Number(respondQueue).toLocaleString()}`}
            onClick={goToRespondMode} />
          <HomePageCard
            icon={staticAsset('media/icons/moderate.svg')}
            title='Moderate'
            subtitle={`Queue: ${Number(moderateQueue).toLocaleString()}`}
            onClick={goToModerateMode}/>
        </section>

        <footer className='home-page-footer'>
          <a
            className='home-page-footer-link'
            href={feedbackLink}
            target='_blank'>
                        Submit Feedback
          </a>
          <a
            className='home-page-footer-link'
            href={aboutLink}
            target='_blank'>
                        About
          </a>
        </footer>
      </div>
    )
  }
}
