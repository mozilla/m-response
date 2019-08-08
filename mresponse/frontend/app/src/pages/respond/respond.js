import React from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import { FirstChild } from '@components/first-child'

import Toolbar from '@components/toolbar'
import ReviewCard from '@components/respond-card'
import Button from '@components/buttons'
import AlertPrompt from '@components/alert-prompt'
import Textarea from '@components/textarea'
import SideBar from '@components/side-bar'
import CannedResponses from '@components/canned-responses'
import HelpDocs from '@components/help-docs'
import Icon from '@components/icon'
import { staticAsset } from '@utils/urls'
import './respond.scss'

export default class RespondPage extends React.Component {
  state = {
    isResponding: false,
    isDoneEditing: false,
    hasSubmitted: false,
    isCannedMenuOpen: false,
    isHelpDocsMenuOpen: false,
    response: this.props.response || '',
    messages: []
  }

  componentWillMount () {
    this.props.fetchNewReviews((successMessage, err) => {
      if (err) {
        this.pushMessage(err, true)
      }
    })
  }

  render () {
    const {
      back,
      review,
      nextReview,
      profile: {
        canSkipModeration
      },
      cannedResponses,
      helpDocs
    } = this.props

    const {
      isResponding,
      isDoneEditing,
      isCannedMenuOpen,
      isHelpDocsMenuOpen,
      response,
      messages
    } = this.state

    const sideBarCannedContent = (
      <CannedResponses cannedData={cannedResponses}/>
    )

    const rightHelpMenu = (
      <button className="toolbar-right-help-button" onClick={this.toggHelpDocsMenu}>
        <Icon iconName='help'/>
      </button>
    )

    const sideBarHelpContent = (
      <HelpDocs helpData={helpDocs} openTo='responding'/>
    )

    return (
      <div className='respond-page'>

        <header>
          <Toolbar
            className='respond-page-toolbar'
            title='Respond'
            invertBackIcon={true}
            onBack={back}
            rightComponent={rightHelpMenu} />
        </header>

        {messages.map(message => (
          <AlertPrompt
            className='respond-page-alert-prompt'
            title={message.title}
            message={message.text}
            isError={message.isError}
            key={message.title} />
        ))}

        {review ? (
          <div className='respond-page-container'>
            <ReviewCard
              className='respond-page-review'
              author={review.author}
              date={review.lastModified}
              review={review.text}
              rating={review.rating}
              productName={review.product.name}
              productVersion={review.product.version || {}}
              productImage={review.product.image}
              androidVersion={review.androidVersion}
            />
          </div>
        ) : null}

        {review && isResponding && !isDoneEditing ? (
          <div className='respond-page-edit-response'>
            <div className='respond-page-edit-response-content'>
              <div className='response-page-response-actions'>
                <Button
                  label='Canned Responses'
                  className='respond-page-edit-response-guide-button'
                  icon={staticAsset('media/icons/sidebar.svg')}
                  onClick={this.toggCannedResponses} />
              </div>
              <form className='respond-page-edit-response-form'>
                <Textarea
                  maxLength={340}
                  value={response}
                  placeholder='Add Your Response'
                  onChange={this.updateResponse}
                  rows={6}
                />
                <Button
                  label='Done'
                  className='respond-page-edit-response-form-submit'
                  onClick={this.saveResponseInput} />
                <Button
                  type='link'
                  label='Cancel'
                  className='respond-page-edit-response-form-cancel'
                  onClick={this.cancelResponseInput} />
              </form>
            </div>
          </div>
        ) : null}

        {review && isResponding & isDoneEditing ? (
          <div className='respond-page-container'>
            <div className='respond-page-preview-response'>
              <span className='respond-page-preview-response-caption'>Your Response</span>
              <p className='respond-page-preview-response-content'>{response}</p>
            </div>
          </div>
        ) : null}

        {review ? isResponding
          ? isDoneEditing ? (
            <div className='respond-page-actions'>
              <Button
                label={`${canSkipModeration ? 'Submit' : 'Submit for Moderation'}`}
                className='respond-page-actions-submit'
                onClick={this.submitResponse} />
              <span
                className='respond-page-actions-skip'
                onClick={this.editResponseInput}>Edit</span>
            </div>
          ) : null : (
            <div className='respond-page-actions'>
              <Button
                label='Respond'
                className='respond-page-actions-respond'
                onClick={this.setIsResponding} />
              <span
                className='respond-page-actions-skip'
                onClick={() => { this.props.skipReview() }}>Skip</span>
            </div>
          ) : null}

        {nextReview && !isResponding ? (
          <div className='respond-page-container'>
            <ReviewCard
              className='respond-page-next-review'
              author={nextReview.author}
              date={nextReview.lastModified}
              review={nextReview.text}
              rating={nextReview.rating}
              productName={nextReview.product.name}
              productImage={nextReview.product.image}
              productVersion={nextReview.product.version || {}}
              androidVersion={nextReview.androidVersion}
            />
          </div>
        ) : null}

        <CSSTransitionGroup
          transitionName='sideBarAnim'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          component={FirstChild}>
          {isCannedMenuOpen ? <SideBar
            className=''
            title='Canned Responses'
            handleClose={this.toggCannedResponses.bind(this)}
            handleCloseOffWindow={this.toggCannedResponsesOffWindow.bind(this)}
            content={sideBarCannedContent} /> : null}
        </CSSTransitionGroup>

        <CSSTransitionGroup
          transitionName='sideBarAnim'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          component={FirstChild}>
          {isHelpDocsMenuOpen ? <SideBar
            className=''
            title='Canned Responses'
            handleClose={this.toggHelpDocsMenu.bind(this)}
            handleCloseOffWindow={this.toggHelpDocsMenuOffWindow.bind(this)}
            content={sideBarHelpContent} /> : null}
        </CSSTransitionGroup>

      </div>
    )
  }

  // openGuideBook = () => window.open(this.props.guideBookUrl)
  toggCannedResponses = (e) => {
    e.preventDefault()
    this.setState({ isCannedMenuOpen: !this.state.isCannedMenuOpen })
  }
  toggCannedResponsesOffWindow = (e) => {
    e.preventDefault()
    if (e.currentTarget === e.target) this.setState({ isCannedMenuOpen: !this.state.isCannedMenuOpen })
  }

  toggHelpDocsMenu = (e) => {
    e.preventDefault()
    this.setState({ isHelpDocsMenuOpen: !this.state.isHelpDocsMenuOpen })
  }
  toggHelpDocsMenuOffWindow = (e) => {
    e.preventDefault()
    if (e.currentTarget === e.target) this.setState({ isHelpDocsMenuOpen: !this.state.isHelpDocsMenuOpen })
  }

  setIsResponding = () => this.setState({
    successMessage: null,
    isResponding: true
  })

  saveResponseInput = e => {
    e.preventDefault()
    this.setState({ isDoneEditing: true })
  }

  cancelResponseInput = e => {
    e.preventDefault()
    this.setState({ isResponding: false, response: '' })
  }

  updateResponse = e => {
    this.setState({ response: e.target.value })
    this.props.onResponseUpdate(e.target.value)
  }

  editResponseInput = () => this.setState({ isDoneEditing: false })

  submitResponse = () => {
    const isValid = this.validateResponse()
    if (this.props.review.assignmentExpiration - Date.now() < 0) {
      this.props.fetchNewReviews()
      return null
    }

    if (isValid) {
      this.props.submitResponse((successMessage, err) => {
        if (err) {
          this.pushMessage(err, true)
        } else {
          this.pushMessage(successMessage)
        }
        this.refreshData()
      })
    }
  }

  validateResponse = () => true

  pushMessage = (text, isError = false) => {
    let message = {}
    if (isError) {
      message = {
        title: 'Error!',
        text,
        isError: true
      }
    } else {
      message = {
        title: 'Success',
        text,
        isError: false
      }
    }
    this.setState({ messages: [message, ...this.state.messages] })
  }

  refreshData = () => this.setState({
    isResponding: false,
    isDoneEditing: false,
    hasSubmitted: false,
    response: ''
  })
}
