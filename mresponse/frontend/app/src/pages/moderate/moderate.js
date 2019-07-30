import React, { Fragment } from 'react'

import Toolbar from '@components/toolbar'
import ModerateCard from '@components/moderate-card'
import Button from '@components/buttons'
import ToggleButton from '@components/buttons/toggle'
import AlertPrompt from '@components/alert-prompt'
import Textarea from '@components/textarea'
import WelcomeModal from '@components/welcome-modal'
import { staticAsset } from '@utils/urls'
import './moderate.scss'

export default class ModeratePage extends React.Component {
  state = {
    isModerating: false,
    isDoneEditing: false,
    hasSubmitted: false,
    isWelcomeOpen: true,
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

    // Check if welcome has already been closed
    const hideWelcome = localStorage.getItem('hide-moderate-welcome')
    if (hideWelcome) this.setState({ isWelcomeOpen: false })
  }

  render () {
    const {
      back,
      response,
      profile: {
        canSkipModeration
      }
    } = this.props

    const {
      isModerating,
      messages,
      criteria,
      isWelcomeOpen
    } = this.state

    return (
      <div className='moderate-page'>
        {isWelcomeOpen ? (
          <WelcomeModal
            forPage='moderate'
            title='Welcome to Moderating'
            text='Moderating helps ensure the quality of our Play Store responses remains high while providing friendly, constructive feedback to our fellow contributors'
            handleClose={this.closeWelcome.bind(this)} />
        ) : null}

        <Toolbar
          className='moderate-page-toolbar'
          title='Moderate'
          invertBackIcon={true}
          onBack={back} />

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
      </div>
    )
  }

  closeWelcome () {
    this.setState({ isWelcomeOpen: false })
    localStorage.setItem('hide-moderate-welcome', 'true')
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
