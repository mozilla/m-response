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
    this.props.updateKarma()
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
        languages
      },
      editProfile
    } = this.props

    const rightHelpMenu = (
      <button className="toolbar-right-help-button" onClick={this.toggHelpDocsMenu}>
        <Icon iconName='help'/>
      </button>
    )

    const sideBarContent = (
      <HelpDocs openTo='profile'/>
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
                  value: 0,
                  maxValue: 0
                },
                {
                  title: 'Issue',
                  value: 0,
                  maxValue: 0
                },
                {
                  title: 'Personal',
                  value: 0,
                  maxValue: 0
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
