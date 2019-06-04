import React, { Fragment } from 'react'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import Toolbar from '@components/toolbar'
import ModerateCard from '@components/moderate-card'
import Button from '@components/buttons'
import ToggleButton from '@components/buttons/toggle'
import AlertPrompt from '@components/alert-prompt'
import { staticAsset } from '@utils/urls'
import './moderate.scss'

export default class ModeratePage extends React.Component {
  state = {
    isModerating: false,
    isDoneEditing: false,
    hasSubmitted: false,
    response: this.props.response || '',
    criteria: {
      positive: null,
      relevant: null,
      personal: null
    },
    karmaAwarded: 10,
    messages: []
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
      }
    } = this.props

    const {
      isModerating,
      messages,
      criteria,
      karmaAwarded
    } = this.state

    return (
      <div className='moderate-page'>
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
                      Is the response {' '}
                      <span className="moderate-page-form-row-emphasis">positive in tone?</span>
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
                      Does the response {' ' }
                      <span className="moderate-page-form-row-emphasis">address the issue?</span>
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
                      Is the response {' ' }
                      <span className="moderate-page-form-row-emphasis">personal?</span>
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

                  <div className='moderate-page-form-row'>
                    <span className='moderate-page-form-row-title'>Reward Responder:</span>
                    <div className='moderate-page-form-row-karma'>
                      <span className='moderate-page-form-row-karma-label'>{karmaAwarded} Karma</span>
                      <Slider
                        min={0}
                        max={20}
                        defaultValue={karmaAwarded}
                        onChange={val => this.setState({ karmaAwarded: val })}
                        className='moderate-page-form-row-karma-slider'
                        handleStyle={{
                          border: 'solid 2px black',
                          backgroundColor: 'black'
                        }}
                        trackStyle={{
                          backgroundColor: 'black'
                        }} />
                    </div>
                  </div>

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

            <div className='moderate-page-actions'>
              {canSkipModeration && !isModerating &&
                <Button
                  label='Moderate'
                  className='moderate-page-actions-moderate'
                  onClick={this.setIsModerating} />
              }
              <span
                className='moderate-page-actions-skip'
                onClick={() => {
                  this.handleSkip()
                }}>Skip</span>
            </div>
          </Fragment>
        ) : null}
      </div>
    )
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
      karma: this.state.karmaAwarded
    })
    this.props.submitModeration((successMessage, err) => {
      if (err) {
        this.pushMessage(err, true)
      } else {
        this.pushMessage(successMessage)
      }
      this.resetData()
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

  resetData = () => this.setState(state => {
    return {
      ...state,
      criteria: {
        positive: null,
        relevant: null,
        personal: null
      },
      karmaAwarded: 10
    }
  })

  resetForm = () => this.setState(state => {
    return {
      ...state,
      // Hide form again if trusted user
      isModerating: false
    }
  })

  handleSkip = () => {
    const {
      skipResponse,
      profile: {
        canSkipModeration
      }
    } = this.props

    if (canSkipModeration) {
      this.resetForm()
    }

    this.resetData()

    skipResponse()
  }
}
