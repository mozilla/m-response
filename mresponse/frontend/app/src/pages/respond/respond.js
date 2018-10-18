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
      this.props.fetchNewReviews()
    }

    render () {
      const {
        back,
        review
        // nextReview
      } = this.props
      const { isResponding, isDoneEditing, response, messages } = this.state

      return (
        <div className='respond-page'>
          <Toolbar title='Respond' invertBackIcon={true} onBack={back} />

          {messages.map(message => (
            <AlertPrompt
              className='respond-page-alert-prompt'
              title={message.title}
              message={message.text}
              isError={message.isError} />
          ))}

          <ReviewCard
            className='respond-page-review'
            author={review.author}
            date={review.lastModified}
            review={review.text}
            rating={review.rating}
            productName={review.product.name}
            productVersion={review.product.version}
            productImage={review.product.image}
            androidVersion={review.androidVersion}
          />

          {isResponding && !isDoneEditing ? (
            <div className='respond-page-edit-response'>
              <div className='respond-page-edit-response-content'>
                <div className='response-page-response-actions'>
                  <Button
                    label='Guide Book'
                    className='respond-page-edit-response-guide-button'
                    icon={staticAsset('media/icons/book.svg')}
                    onClick={this.openGuideBook} />
                </div>
                <form className='respond-page-edit-response-form' onSubmit={this.saveResponseInput}>
                  <textarea
                    className='respond-page-edit-response-form-text'
                    name="response-text"
                    value={response}
                    onChange={this.updateResponse} />
                  <Button
                    label='Done'
                    className='respond-page-edit-response-form-submit' />
                </form>
              </div>
            </div>
          ) : null}

          {isResponding & isDoneEditing ? (
            <div className='respond-page-preview-response'>
              <span className='respond-page-preview-response-caption'>Your Response</span>
              <p className='respond-page-preview-response-content'>{response}</p>
            </div>
          ) : null}

          {isResponding
            ? isDoneEditing ? (
              <div className='respond-page-actions'>
                <Button
                  label='Submit for Moderation'
                  className='respond-page-actions-respond'
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
            )}

          {/* {!isResponding ? (
            <ReviewCard
              className='respond-page-next-review'
              author={nextReview.author}
              date={nextReview.lastModified}
              review={nextReview.text}
              rating={nextReview.rating}
              productName={nextReview.product.name}
              productImage={nextReview.product.image}
              androidVersion={nextReview.androidVersion}
            />
          ) : null} */}

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
        this.props.fetchNextReview()
        return null
      }

      if (isValid) {
        this.props.submitResponse((successMessage, err) => {
          let message = {}
          if (err) {
            message = {
              title: 'Error!',
              text: err,
              isError: true
            }
          } else {
            message = {
              title: 'Success',
              text: successMessage,
              isError: false
            }
          }
          this.setState({ messages: [message, ...this.state.messages] })
          this.refreshData()
        })
      }
    }

    validateResponse = () => true

    refreshData = () => this.setState({
      isResponding: false,
      isDoneEditing: false,
      hasSubmitted: false,
      response: ''
    })
}
