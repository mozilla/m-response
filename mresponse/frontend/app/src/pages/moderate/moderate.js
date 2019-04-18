import React from 'react'

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
      positive: false,
      relevant: false,
      personal: false
    },
    karmaAwarded: 10,
    messages: []
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
      response
      // nextReview
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
                  <span className="moderate-page-form-row-emphasis">positive in tone?</span>
                </span>
                <div className='moderate-page-form-row-buttons'>
                  <ToggleButton
                    label="Yes!"
                    toggled={true}
                    onClick={() => this.toggleCriteria('positive')}
                    icon={staticAsset('media/icons/smile.svg')} />
                  <ToggleButton
                    label="Not Really"
                    toggled={false}
                    onClick={() => this.toggleCriteria('positive')}
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
                    onClick={() => this.toggleCriteria('relevant')}
                    icon={staticAsset('media/icons/smile.svg')} />
                  <ToggleButton
                    label="Not Really"
                    toggled={criteria.relevant === false}
                    onClick={() => this.toggleCriteria('relevant')}
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
                    onClick={() => this.toggleCriteria('personal')}
                    icon={staticAsset('media/icons/smile.svg')} />
                  <ToggleButton
                    label="Not Really"
                    toggled={criteria.personal === false}
                    onClick={() => this.toggleCriteria('personal')}
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

            </div>
          </div>
        ) : null}

        {response ? isModerating
          ? (
            <div className='moderate-page-actions'>
              <Button
                label='Submit'
                className='moderate-page-actions-moderate'
                onClick={this.submitModeration} />
            </div>
          ) : (
            <div className='moderate-page-actions'>
              <Button
                label='Moderate'
                className='moderate-page-actions-moderate'
                onClick={this.setIsModerating} />
              <span
                className='moderate-page-actions-skip'
                onClick={this.props.skipResponse}>Skip</span>
            </div>
          ) : null}

      </div>
    )
  }

  toggleCriteria = option => {
    const { criteria } = this.state
    criteria[option] = !criteria[option]
    this.setState({ criteria })
  }

  setIsModerating = () => this.setState({
    successMessage: null,
    isModerating: true
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
    },
    karmaAwarded: 10
  })
}
