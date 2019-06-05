import React from 'react'

import Toolbar from '@components/toolbar'
import ModerateCard from '@components/moderate-card'
import Button from '@components/buttons'
import ToggleButton from '@components/buttons/toggle'
import AlertPrompt from '@components/alert-prompt'
import Textarea from '@components/textarea'
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
    messages: [],
    feedbackMessage: ''
  }

  componentWillMount () {
    this.props.fetchNextResponse((successMessage, err) => {
      if (err) {
        this.pushMessage(err, true)
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
      criteria
    } = this.state

    return (
      <div className='moderate-page'>
        <Toolbar
          className='moderate-page-toolbar'
          title='Moderate'
          invertBackIcon={true}
          onBack={back} />

        {messages.map((message, index) => (
          <div className='moderate-page-container'>
            <AlertPrompt
              key={`moderate-alert-${index}`}
              className='respond-page-alert-prompt'
              title={message.title}
              message={message.text}
              isError={message.isError} />
          </div>
        ))}

        {response ? (
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
        ) : null}

        {response && isModerating ? (
          <div className='moderate-page-container'>
            <div className='moderate-page-form'>
              <div className='moderate-page-form-row'>
                <span className='moderate-page-form-row-title'>
                  Is the response {' '}
                  <span className="moderate-page-form-row-strong">positive in tone?</span>
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
                  <span className="moderate-page-form-row-strong">address the issue?</span>
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
                  <span className="moderate-page-form-row-strong">personal?</span>
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
                    Feedback message {' ' }
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
        ) : null}

        {response && !isModerating &&
          <div className='moderate-page-actions'>
            <Button
              label='Moderate'
              className='moderate-page-actions-moderate'
              onClick={this.setIsModerating} />
            <span
              className='moderate-page-actions-skip'
              onClick={this.props.skipResponse}>Skip</span>
          </div>
        }
      </div>
    )
  }

  toggleCriteria = (option, value) => {
    this.setState((state) => ({
      criteria: {
        ...state.criteria,
        [option]: value
      }
    }))
  }

  allCriteriaAnswered = (criteria) => {
    return Object.entries(criteria).every(([, value]) => value !== null)
  }

  setIsModerating = () => this.setState({
    successMessage: null,
    isModerating: true
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
      this.refreshData()
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
    this.setState({ messages: [message, ...this.state.messages] })
  }

  refreshData = () => this.setState({
    isModerating: false,
    criteria: {
      positive: false,
      relevant: false,
      personal: false
    }
  })
}
