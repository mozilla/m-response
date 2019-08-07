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
      respondQueue,
      moderateQueue,
      goToRespondMode,
      goToModerateMode,
      leaderboard,
      helpDocs
    } = this.props

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
            src={staticAsset('media/mozilla-logo-white.png')}
            alt='' />
          <Avatar
            className='home-page-header-avatar'
            src={profile.picture}
            karma={profile.karma.points}
            coverIcon={staticAsset('media/icons/user.svg')}
            onClick={goToProfile} />
        </header>

        <section className='home-page-content'>
          <HomePageCard
            icon={staticAsset('media/icons/respond-black.svg')}
            bgColor='orange'
            title='Respond'
            subtitle={`Queue: ${Number(respondQueue).toLocaleString()}`}
            onClick={goToRespondMode} />
          <HomePageCard
            icon={staticAsset('media/icons/moderate-black.svg')}
            bgColor='blue-lighter'
            title='Moderate'
            subtitle={`Queue: ${Number(moderateQueue).toLocaleString()}`}
            onClick={goToModerateMode} />

          <Leaderboard
            className="home-page-leaderboard"
            leaderboard={leaderboard} />
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
          <a
            className='home-page-footer-link'
            href={aboutLink}
            onClick={this.toggHelpDocsMenu}>
            <Icon iconName='help' className='home-page-footer-link-icon-question'></Icon>
            Help Docs
          </a>
        </footer>

        <CSSTransitionGroup
          transitionName='sideBarAnim'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          component={FirstChild}>
          {isHelpDocsMenuOpen ? <SideBar
            className=''
            title='Help and Documentation'
            handleClose={this.toggHelpDocsMenu.bind(this)}
            handleCloseOffWindow={this.toggHelpDocsMenuOffWindow.bind(this)}
            content={sideBarContent} /> : null}
        </CSSTransitionGroup>
      </div>
    )
  }

  toggHelpDocsMenu = (e) => {
    e.preventDefault()
    this.setState({ isHelpDocsMenuOpen: !this.state.isHelpDocsMenuOpen })
  }
  toggHelpDocsMenuOffWindow = (e) => {
    e.preventDefault()
    if (e.currentTarget === e.target) this.setState({ isHelpDocsMenuOpen: !this.state.isHelpDocsMenuOpen })
  }
}
