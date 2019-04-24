import React from 'react'

import Toolbar from '@components/toolbar'
import ReviewCard from '@components/respond-card'
import Button from '@components/buttons'
import AlertPrompt from '@components/alert-prompt'
import { staticAsset } from '@utils/urls'
import './respond.scss'

export default class RespondPage extends React.Component {
  state = {
    isResponding: false,
    isDoneEditing: false,
    hasSubmitted: false,
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
      nextReview
    } = this.props
    const { isResponding, isDoneEditing, response, messages } = this.state

    return (
      <div className='respond-page'>
        <Toolbar
          className='respond-page-toolbar'
          title='Respond'
          invertBackIcon={true}
          onBack={back} />

        {messages.map(message => (
          <AlertPrompt
            className='respond-page-alert-prompt'
            title={message.title}
            message={message.text}
            isError={message.isError} />
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
                  label='Guide Book'
                  className='respond-page-edit-response-guide-button'
                  icon={staticAsset('media/icons/book.svg')}
                  onClick={this.openGuideBook} />
              </div>
              <form className='respond-page-edit-response-form'>
                <textarea
                  maxLength="340"
                  className='respond-page-edit-response-form-text'
                  name="response-text"
                  value={response}
                  placeholder='Add Your Response'
                  onChange={this.updateResponse} />
                <Button
                  label='Done'
                  className='respond-page-edit-response-form-submit'
                  onClick={this.saveResponseInput} />
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
                label='Submit for Moderation'
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

      </div>
    )
  }

  openGuideBook = () => window.open(this.props.guideBookUrl)

  setIsResponding = () => this.setState({
    successMessage: null,
    isResponding: true
  })

  saveResponseInput = e => {
    e.preventDefault()
    this.setState({ isDoneEditing: true })
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
