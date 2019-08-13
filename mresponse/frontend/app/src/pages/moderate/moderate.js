import React, { Fragment } from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import { FirstChild } from '@components/first-child'

import Toolbar from '@components/toolbar'
import ModerateCard from '@components/moderate-card'
import Button from '@components/buttons'
import ToggleButton from '@components/buttons/toggle'
import AlertPrompt from '@components/alert-prompt'
import Textarea from '@components/textarea'
import SideBar from '@components/side-bar'
import CannedResponses from '@components/canned-responses'
import HelpDocs from '@components/help-docs'
import Icon from '@components/icon'
import { staticAsset } from '@utils/urls'
import './moderate.scss'

export default class ModeratePage extends React.Component {
  state = {
    isModerating: false,
    isDoneEditing: false,
    hasSubmitted: false,
    isCannedMenuOpen: false,
    isHelpDocsMenuOpen: false,
    response: this.props.response || '',
    criteria: {
      positive: null,
      relevant: null,
      personal: null
    },
    messages: [],
    feedbackMessage: ''
  }

  componentWillMount () {
    const {
      fetchNextResponse,
      profile: {
        canSkipModeration
      }
    } = this.props

    fetchNextResponse((successMessage, err) => {
      if (err) {
        this.pushMessage(err, true)
      }
    })

    // If the user is not trusted,
    // set isModerating to show the form immediately
    this.setState(state => {
      return {
        ...state,
        isModerating: !canSkipModeration
      }
    })
  }

  render () {
    const {
      back,
      response,
      profile: {
        canSkipModeration
      },
      cannedResponses,
      helpDocs
    } = this.props

    const {
      isModerating,
      messages,
      criteria,
      isCannedMenuOpen,
      isHelpDocsMenuOpen
    } = this.state

    const sideBarCannedContent = (
      <CannedResponses cannedData={cannedResponses}/>
    )

    const rightHelpMenu = (
      <button className="toolbar-right-help-button" onClick={() => (this.toggHelpDocsMenu())}>
        <Icon iconName='help'/>
      </button>
    )

    const sideBarHelpContent = (
      <HelpDocs helpData={helpDocs} openTo='moderating'/>
    )

    return (
      <div className='moderate-page'>
        <header className='moderate-page-header'>
          <Toolbar
            className='moderate-page-toolbar'
            title='Moderate'
            invertBackIcon={true}
            onBack={back}
            rightComponent={rightHelpMenu} />
        </header>

        {messages.map((message, index) => (
          <div
            key={`moderate-alert-${index}`}
            className='moderate-page-container'
          >
            <AlertPrompt
              className='respond-page-alert-prompt'
              title={message.title}
              message={message.text}
              isError={message.isError} />
          </div>
        ))}

        {response ? (
          <Fragment>
            <div className='moderate-page-container'>
              <ModerateCard
                className='moderate-page-response'
                reviewAuthor={response.review.author}
                reviewDate={response.review.dateSubmitted}
                reviewText={response.review.text}
                reviewRating={response.review.rating}
                responseText={response.text}
                responseDate={response.submittedAt}
                productName={response.review.product.name}
                productImage={response.review.product.image}
                productVersion={response.review.product.version || {}}
                androidVersion={response.review.androidVersion}
              />
            </div>

            {isModerating &&
              <div className='moderate-page-container'>
                <div className='moderate-page-form'>
                  <div className='moderate-page-form-row'>
                    <span className='moderate-page-form-row-title'>
                      Does this response {' '}
                      <span className="moderate-page-form-row-strong">feel friendly?</span>
                    </span>
                    <div className='moderate-page-form-row-buttons'>
                      <ToggleButton
                        label="Yes!"
                        toggled={criteria.positive === true}
                        handleClick={() => this.toggleCriteria('positive', true)}
                        icon={staticAsset('media/icons/smile.svg')} />
                      <ToggleButton
                        label="Not Really"
                        toggled={criteria.positive === false}
                        handleClick={() => this.toggleCriteria('positive', false)}
                        icon={staticAsset('media/icons/sad.svg')} />
                    </div>
                  </div>

                  <div className='moderate-page-form-row'>
                    <span className='moderate-page-form-row-title'>
                      Is this response {' '}
                      <span className="moderate-page-form-row-strong">technically accurate?</span>
                    </span>
                    <div className='moderate-page-form-row-buttons'>
                      <ToggleButton
                        label="Yes!"
                        toggled={criteria.relevant === true}
                        handleClick={() => this.toggleCriteria('relevant', true)}
                        icon={staticAsset('media/icons/smile.svg')} />
                      <ToggleButton
                        label="Not Really"
                        toggled={criteria.relevant === false}
                        handleClick={() => this.toggleCriteria('relevant', false)}
                        icon={staticAsset('media/icons/sad.svg')} />
                    </div>
                  </div>

                  <div className='moderate-page-form-row'>
                    <span className='moderate-page-form-row-title'>
                      <span className="moderate-page-form-row-strong">Would you reuse this response</span>{' '}
                      for a similar question?
                    </span>
                    <div className='moderate-page-form-row-buttons'>
                      <ToggleButton
                        label="Yes!"
                        toggled={criteria.personal === true}
                        handleClick={() => this.toggleCriteria('personal', true)}
                        icon={staticAsset('media/icons/smile.svg')} />
                      <ToggleButton
                        label="Not Really"
                        toggled={criteria.personal === false}
                        handleClick={() => this.toggleCriteria('personal', false)}
                        icon={staticAsset('media/icons/sad.svg')} />
                    </div>
                  </div>

                  {canSkipModeration &&
                    <div className='moderate-page-form-row'>
                      <span className='moderate-page-form-row-title'>
                        Feedback message {' '}
                        <span className="moderate-page-form-row-em">(optional)</span>
                      </span>
                      <div>
                        <Textarea
                          value={this.state.feedbackMessage}
                          onChange={event => this.setState({ feedbackMessage: event.target.value })}
                        />
                      </div>
                    </div>
                  }

                  <div className='moderate-page-actions moderate-page-actions--form'>
                    <Button
                      label='Submit'
                      className='moderate-page-actions-moderate'
                      onClick={this.submitModeration}
                      disabled={!this.allCriteriaAnswered(criteria)}
                    />
                  </div>
                </div>
              </div>
            }

            {canSkipModeration && !isModerating &&
              <div className='moderate-page-actions moderate-page-actions--trusted'>
                <Button
                  label='Approve'
                  className='moderate-page-actions-approve'
                  onClick={this.submitApproval}
                  icon={staticAsset('media/icons/check-white.svg')} />
                <Button
                  label='Moderate'
                  className='moderate-page-actions-moderate'
                  onClick={this.setIsModerating} />
              </div>
            }

            {canSkipModeration && isModerating ? (
              <div className='moderate-page-actions'>
                <span
                  className='moderate-page-actions-skip'
                  onClick={() => {
                    this.resetAll()
                  }}>Back</span>
              </div>
            ) : (
              <div className='moderate-page-actions'>
                <span
                  className='moderate-page-actions-skip'
                  onClick={() => {
                    this.handleSkip()
                  }}>Skip</span>
              </div>
            )}
          </Fragment>
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
            handleCloseOffWindow={this.toggCannedResponses.bind(this)}
            content={sideBarCannedContent} /> : null}
        </CSSTransitionGroup>

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
            content={sideBarHelpContent} /> : null}
        </CSSTransitionGroup>
      </div>
    )
  }

  toggCannedResponses = (e) => {
    const toggMenu = () => (this.setState({ isCannedMenuOpen: !this.state.isCannedMenuOpen }))
    if (e) {
      if (e.currentTarget === e.target) toggMenu()
    } else toggMenu()
  }

  toggHelpDocsMenu = (e) => {
    const toggMenu = () => (this.setState({ isHelpDocsMenuOpen: !this.state.isHelpDocsMenuOpen }))
    if (e) {
      if (e.currentTarget === e.target) toggMenu()
    } else toggMenu()
  }

  toggleCriteria = (option, value) => {
    this.setState(state => ({
      ...state,
      criteria: {
        ...state.criteria,
        [option]: value
      }
    }))
  }

  allCriteriaAnswered = (criteria) => {
    return Object.entries(criteria).every(([, value]) => value !== null)
  }

  setIsModerating = () => this.setState(state => {
    return {
      ...state,
      isModerating: true
    }
  })

  submitModeration = () => {
    // TODO @ REDUX STAGE: SUBMIT LOGIC...
    this.props.onModerationUpdate({
      criteria: this.state.criteria,
      feedbackMessage: this.state.feedbackMessage
    })
    this.props.submitModeration((successMessage, err) => {
      if (err) {
        this.pushMessage(err, true)
      } else {
        this.pushMessage(successMessage)
      }
      this.resetAll()
    })
  }

  submitApproval = () => {
    this.props.submitApproval((message, err) => {
      if (err) {
        this.pushMessage(message, true)
      } else {
        this.pushMessage(message)
      }
      this.resetAll()
    })
  }

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
    this.setState(state => {
      return { messages: [message, ...state.messages] }
    })
  }

  resetAll = () => {
    const {
      profile: {
        canSkipModeration
      }
    } = this.props

    // Clear form data
    this.resetData()

    // Reset the form to it's hidden for trusted users
    if (canSkipModeration) {
      this.resetForm()
    }
  }

  resetData = () => this.setState(state => {
    return {
      ...state,
      criteria: {
        positive: null,
        relevant: null,
        personal: null
      },
      feedbackMessage: ''
    }
  })

  resetForm = () => this.setState(state => {
    return {
      ...state,
      isModerating: false
    }
  })

  handleSkip = () => {
    const {
      skipResponse
    } = this.props

    skipResponse((message, err) => {
      if (err) {
        this.pushMessage(message, true)
      } else {
        this.resetAll()
      }
    })
  }
}
