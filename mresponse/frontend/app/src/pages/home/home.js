import React from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import { FirstChild } from '@components/first-child'

import Avatar from '@components/avatar'
import HomePageCard from '@components/home-page-card'
import Leaderboard from '@components/leaderboard'
import SideBar from '@components/side-bar'
import HelpDocs from '@components/help-docs'
import Icon from '@components/icon'
import { staticAsset } from '@utils/urls'

import './home.scss'

export default class HomePage extends React.Component {
  reviewCount = () => {
    let reviewString = ''
    let reviewCount = 0
    if (this.props.respondThreeDaysQueue) {
      reviewString = 'in the last 3 days'
      reviewCount = this.props.respondThreeDaysQueue
    } else {
      reviewString = 'in total'
      reviewCount = this.props.respondQueue
    }

    return {
      reviewCount: Number(reviewCount).toLocaleString(),
      queueText: reviewString
    }
  }

  state = {
    isHelpDocsMenuOpen: false
  }

  componentWillMount () {
    this.props.updateAppConfig()
    this.props.updateHomeConfig()
    this.props.updateKarma()
    this.props.updateProfile()
    this.props.updateLeaderboard()
    this.props.updateCannedResponses()
    this.props.updateHelpDocs()
  }

  render () {
    const {
      isHelpDocsMenuOpen
    } = this.state

    const {
      profile,
      feedbackLink,
      aboutLink,
      goToProfile,
      moderateQueue,
      goToRespondMode,
      goToModerateMode,
      leaderboard,
      helpDocs
    } = this.props
    const queueData = this.reviewCount()

    const sideBarContent = (
      <HelpDocs helpData={helpDocs} />
    )

    if (!profile) {
      return null
    }

    return (
      <div className='home-page'>
        <header className='home-page-header'>
          <img
            className='home-page-header-logo'
            src={staticAsset('media/mozilla-logo-white.svg')}
            alt='' />
          <Avatar
            className='home-page-header-avatar'
            src={profile.picture}
            karma={profile.karma.points}
            coverIcon={staticAsset('media/icons/user.svg')}
            onClick={goToProfile} />
        </header>

        <div className='home-page-wrap'>
          <section className='home-page-content'>
            <HomePageCard
              icon={staticAsset('media/icons/respond-black.svg')}
              bgColor='orange'
              title='Respond'
              subtitle={`${queueData.reviewCount} ${queueData.queueText}`}
              onClick={goToRespondMode} />
            <HomePageCard
              icon={staticAsset('media/icons/moderate-black.svg')}
              bgColor='blue-lighter'
              title='Moderate'
              subtitle={`${Number(moderateQueue).toLocaleString()} in total`}
              onClick={goToModerateMode} />

            <Leaderboard
              className="home-page-leaderboard"
              leaderboard={leaderboard} />
          </section>

          <footer className='home-page-footer'>
            <div className='home-page-footer-inner'>
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
              <a
                className='home-page-footer-link home-page-footer-link-w-icon'
                onClick={() => this.toggHelpDocsMenu()}>
                <Icon iconName='help' className='home-page-footer-link-icon-question'></Icon>
                <span>Help Docs</span>
              </a>
            </div>
          </footer>
        </div>

        <CSSTransitionGroup
          transitionName='sideBarAnim'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          component={FirstChild}>
          {isHelpDocsMenuOpen ? <SideBar
            className=''
            title='Help and Documentation'
            handleClose={this.toggHelpDocsMenu.bind(this)}
            content={sideBarContent} /> : null}
        </CSSTransitionGroup>
      </div>
    )
  }

  toggHelpDocsMenu = (e) => {
    const toggMenu = () => (this.setState({ isHelpDocsMenuOpen: !this.state.isHelpDocsMenuOpen }))

    if (e) {
      if (e.currentTarget === e.target) toggMenu()
    } else toggMenu()
  }
}
