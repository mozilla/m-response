import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'
import { FirstChild } from '@components/first-child'

import Toolbar from '@components/toolbar'
import Avatar from '@components/avatar'
import ProgressTable from '@components/progress-table'
import SideBar from '@components/side-bar'
import HelpDocs from '@components/help-docs'
import Icon from '@components/icon'
// import ResponseCard from '@components/response-card'
import Button from '@components/buttons'
import { staticAsset } from '@utils/urls'

import './profile.scss'

export default class ProfilePage extends React.Component {
  state = {
    pictureUpload: null,
    isHelpDocsMenuOpen: false,
    picture: this.props.profile.picture
  }

  constructor (props) {
    super(props)
    this.avatarUploadField = React.createRef()
  }

  componentDidMount () {
    this.props.updateUserMeta()
    this.props.updateProfile()
  }

  render () {
    const {
      isHelpDocsMenuOpen
    } = this.state

    const {
      profile: {
        name,
        karma,
        languages,
        stats,
        isMod
      },
      editProfile,
      helpDocs
    } = this.props

    const rightHelpMenu = (
      <button className="toolbar-right-help-button" onClick={() => (this.toggHelpDocsMenu())}>
        <Icon iconName='help'/>
      </button>
    )

    const sideBarContent = (
      <HelpDocs helpData={helpDocs} openTo='profile'/>
    )

    return (
      <div className="profile">

        <Toolbar
          className='profile-toolbar'
          titleClassName='profile-toolbar-title'
          title="Profile"
          onBack={this.props.back}
          rightComponent={rightHelpMenu}
        />

        <section className='profile-header'>
          <div className='profile-header-container'>
            <div className="profile-header-avatar">
              <Avatar
                src={this.state.picture || ''}
                onClick={() => this.avatarUploadField.current.click()}
                editable/>
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

            </div>

            <div className="profile-header-meta">
              <div className='profile-header-meta-top'>
                <span className="profile-header-meta-top-name">{name || ''}</span>
                <span className="profile-header-meta-top-languages">
                  <img
                    src={staticAsset('media/icons/globe.svg')}
                    className='profile-header-meta-top-languages-icon'
                    alt='' />
                  {languages.map(({ text }, index) =>
                    (index !== languages.length - 1)
                      ? text + ', '
                      : text
                  )}
                </span>
              </div>
              {isMod ? <button className='profile-header-meta-ismodBtn'>Moderator</button> : null}
            </div>
          </div>

          <div className="profile-header-karma">
            <div className='profile-header-karma-group'>
              <span className='profile-header-karma-group-value'>{karma.responsesCount || 0}</span>
              <span className='profile-header-karma-group-label'>Responses</span>
            </div>
            <span className='profile-header-karma-seperator'>|</span>
            <div className='profile-header-karma-group'>
              <span className='profile-header-karma-group-value'>{karma.moderationsCount || 0}</span>
              <span className='profile-header-karma-group-label'>Moderations</span>
            </div>
            <span className='profile-header-karma-seperator'>|</span>
            <div className='profile-header-karma-group'>
              <span className='profile-header-karma-group-value'>{karma.points || 0}</span>
              <span className='profile-header-karma-group-label'>Karma</span>
            </div>
          </div>

        </section>

        <div className='profile-container'>
          <div className=''>
            <section className="profile-feedback-stats">
              <p className="profile-title">Positive feedback stats</p>
              <p className="profile-feedback-stats-title">This Week</p>
              <ProgressTable data={[
                {
                  title: 'Tone',
                  value: stats.positive_in_tone_count,
                  maxValue: stats.positive_in_tone_change || 0
                },
                {
                  title: 'Issue',
                  value: stats.addressing_the_issue_count,
                  maxValue: stats.addressing_the_issue_change || 0
                },
                {
                  title: 'Personal',
                  value: stats.personal_count,
                  maxValue: stats.personal_change || 0
                }
              ]}></ProgressTable>
            </section>

            <section className='profile-progress'>
              <p className='profile-title'>Progress</p>
              <p className='profile-progress-placeholder'>Your progress gauges require two weeks worth of data before they can be displayed</p>
            </section>
          </div>

          <section className='profile-button-wrap'>
            <Button
              className='profile-edit-button'
              label='Settings'
              icon={staticAsset('media/icons/cog.svg')}
              onClick={editProfile} />
          </section>

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

        <CSSTransitionGroup
          transitionName='sideBarAnim'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          component={FirstChild}>
          {isHelpDocsMenuOpen ? <SideBar
            className=''
            title='Help and Documentation'
            handleClose={this.toggHelpDocsMenu.bind(this)}
            handleCloseOffWindow={this.toggHelpDocsMenu.bind(this)}
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

  handleFileUpload = event => {
    const file = event.target.files[0]
    this.props.uploadAvatar(file)
    this.setState({ pictureUpload: file })
    const reader = new FileReader()
    reader.onload = event => {
      this.setState({ picture: event.target.result })
    }
    reader.readAsDataURL(file)
  }
}

ProfilePage.propTypes = {
  profile: PropTypes.object.isRequired,
  back: PropTypes.func.isRequired,
  editProfile: PropTypes.func.isRequired
}
