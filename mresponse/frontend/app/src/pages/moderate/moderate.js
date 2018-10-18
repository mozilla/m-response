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
    karmaAwarded: 10
  }

  componentWillMount () {
    this.props.fetchNewResponse()
  }

  render () {
    const {
      back,
      review,
      response
      // nextReview
    } = this.props
    const {
      isModerating,
      successMessage,
      criteria,
      karmaAwarded
    } = this.state

    return (
      <div className='moderate-page'>
        <Toolbar title='Moderate' invertBackIcon={true} onBack={back} />

        {successMessage ? (
          <AlertPrompt
            className='moderate-page-alert-prompt'
            title={'Success'}
            message={successMessage} />
        ) : null}

        <ModerateCard
          className='moderate-page-review'
          reviewAuthor={review.author}
          reviewDate={review.dateSubmitted}
          reviewText={review.text}
          reviewRating={review.rating}
          responseText={response.text}
          productName={review.product.name}
          productImage={review.product.image}
          androidVersion={review.androidVersion}
        />

        {isModerating ? (
          <div className='moderate-page-form'>
            <div className='moderate-page-form-row'>
              <span className='moderate-page-form-row-title'>Is the response positive in tone?</span>
              <div className='moderate-page-form-row-buttons'>
                <ToggleButton
                  label="Yes!"
                  toggled={criteria.positive === true}
                  onClick={() => this.toggleCriteria('positive')}
                  icon={staticAsset('media/icons/smile.svg')} />
                <ToggleButton
                  label="Not Really"
                  toggled={criteria.positive === false}
                  onClick={() => this.toggleCriteria('positive')}
                  icon={staticAsset('media/icons/sad.svg')} />
              </div>
            </div>

            <div className='moderate-page-form-row'>
              <span className='moderate-page-form-row-title'>Does the response address the issue?</span>
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
              <span className='moderate-page-form-row-title'>Is the response personal?</span>
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
        ) : null}

        {isModerating
          ? (
            <div className='moderate-page-actions'>
              <Button
                label='Submit Moderation'
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
                onClick={this.props.skipReview}>Skip</span>
            </div>
          )}

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
    console.log({
      criteria: this.state.criteria,
      karma: this.state.karmaAwarded
    })
  }

  validateModeration = () => true

  refreshData = () => this.setState({
    isModerating: false,
    isDoneEditing: false,
    hasSubmitted: false,
    response: ''
  })
}
