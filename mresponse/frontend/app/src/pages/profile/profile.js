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
import BasicModal from '@components/basic-modal'
// import ResponseCard from '@components/response-card'
import Button from '@components/buttons'
import { staticAsset } from '@utils/urls'

import './profile.scss'

export default class ProfilePage extends React.Component {
  state = {
    pictureUpload: null,
    isHelpDocsMenuOpen: false,
    picture: this.props.profile.picture,
    progress: {
      tone: 0,
      issue: 0,
      personal: 0
    }
  }

  constructor (props) {
    super(props)
    this.avatarUploadField = React.createRef()
  }

  componentDidMount () {
    this.props.updateUserMeta()
    this.props.updateProfile()

    // calculate progress
    if (this.props.profile.stats.lastWeek.total) {
      const lastWeek = this.props.profile.stats.lastWeek
      const thisWeek = this.props.profile.stats.thisWeek
      const tone = Math.round(((thisWeek.tone / thisWeek.total) - (lastWeek.tone / lastWeek.total)) * 100)
      const issue = Math.round(((thisWeek.issue / thisWeek.total) - (lastWeek.issue / lastWeek.total)) * 100)
      const personal = Math.round(((thisWeek.personal / thisWeek.total) - (lastWeek.personal / lastWeek.total)) * 100)

      this.setState({
        progress: {
          tone,
          issue,
          personal
        }
      })
    }
  }

  render () {
    const {
      isHelpDocsMenuOpen,
      isModModalOpen,
      progress
    } = this.state

    const {
      profile: {
        name,
        karma,
        languages,
        stats,
        isMod,
        isSuperMod
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

    const modModalContent = (
      <div className='profile-modmodalcontent'>
        <p>You are a</p>
        <p><span className='profile-modmodalcontent-badge'>{isMod && !isSuperMod ? 'Moderator' : isSuperMod ? 'Super Moderator' : ''}</span></p>
        <ul>
          <li>Immediately approve responses which meet the moderation criteria.</li>
          <li>Send anonymous feedback to fellow contributers when moderating responses.</li>
          {isSuperMod ? <li>Responses you approve bypass staff review and immediately enter the publishing queue.</li> : null}
        </ul>
      </div>
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
              {isMod && !isSuperMod ? <button className='profile-header-meta-ismodBtn' onClick={this.toggModModal}>Moderator</button> : null}
              {isSuperMod ? <button className='profile-header-meta-ismodBtn' onClick={this.toggModModal}>Super Moderator</button> : null}
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
                  value: stats.thisWeek.tone,
                  maxValue: stats.thisWeek.total
                },
                {
                  title: 'Issue',
                  value: stats.thisWeek.issue,
                  maxValue: stats.thisWeek.total
                },
                {
                  title: 'Personal',
                  value: stats.thisWeek.personal,
                  maxValue: stats.thisWeek.total
                }
              ]}></ProgressTable>
            </section>

            <section className='profile-progress'>
              <p className='profile-title'>Progress</p>
              {stats.lastWeek.total ? <div className='profile-progress-compare'>
                <div className='profile-progress-compare-item'>
                  <div className={`profile-progress-compare-item-indicator ${this.determinProgressIcon(progress.tone)}`}>
                    <Icon iconName={this.determinProgressIcon(progress.tone)}></Icon>
                  </div>
                  <div className='profile-progress-compare-item-percent'>{progress.tone}%</div>
                  <div className='profile-progress-compare-item-label'>Tone</div>
                </div>
                <div className='profile-progress-compare-item'>
                  <div className={`profile-progress-compare-item-indicator ${this.determinProgressIcon(progress.issue)}`}>
                    <Icon iconName={this.determinProgressIcon(progress.issue)}></Icon>
                  </div>
                  <div className='profile-progress-compare-item-percent'><span>{progress.issue}%</span></div>
                  <div className='profile-progress-compare-item-label'><span>Issue</span></div>
                </div>
                <div className='profile-progress-compare-item'>
                  <div className={`profile-progress-compare-item-indicator ${this.determinProgressIcon(progress.personal)}`}>
                    <Icon iconName={this.determinProgressIcon(progress.personal)}></Icon>
                  </div>
                  <div className='profile-progress-compare-item-percent'>{progress.personal}%</div>
                  <div className='profile-progress-compare-item-label'>Personal</div>
                </div>
              </div> : <p className='profile-progress-placeholder'>Your progress gauges require two weeks worth of data before they can be displayed</p>}

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
            content={sideBarContent} /> : null}
        </CSSTransitionGroup>

        <CSSTransitionGroup
          transitionName='fadein'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          component={FirstChild}>
          {isModModalOpen ? <BasicModal
            className=''
            handleClose={this.toggModModal.bind(this)}
            content={modModalContent} /> : null}
        </CSSTransitionGroup>

      </div>
    )
  }

  toggHelpDocsMenu = e => {
    const toggMenu = () => (this.setState({ isHelpDocsMenuOpen: !this.state.isHelpDocsMenuOpen }))
    if (e) {
      if (e.currentTarget === e.target) toggMenu()
    } else toggMenu()
  }

  toggModModal = e => {
    const toggMenu = () => (this.setState({ isModModalOpen: !this.state.isModModalOpen }))
    if (e) {
      if (e.currentTarget === e.target) toggMenu()
    } else toggMenu()
  }

  determinProgressIcon (key) {
    return key > 0 ? 'arrowUp' : key === 0 ? 'dash' : 'arrowDown'
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
