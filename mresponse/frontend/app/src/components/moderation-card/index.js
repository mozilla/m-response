import React from 'react'
import dayjs from 'dayjs'

import RatingStars from '@components/rating-stars'
import './moderation-card.scss'

export default class ModerationCard extends React.Component {
  state = { expanded: false }

  render () {
    const {
      className = '',
      reviewAuthor,
      reviewDate,
      reviewText,
      reviewRating,
      responseText,
      responseDate,
      productImage,
      productName,
      androidVersion
    } = this.props

    const reviewComment = this.state.expanded
      ? reviewText
      : reviewText.substring(0, 130) + '...'

    return (
      <div className={`moderation-card ${className}`}>
        <div className='moderation-card-header'>
          <img
            className='moderation-card-header-image'
            src={productImage} alt='' />
          <div className='moderation-card-header-row-container'>
            <div className='moderation-card-header-row'>
              <span className='moderation-card-header-title'>{reviewAuthor}</span>
              <span className='moderation-card-header-meta'>{androidVersion}</span>
            </div>
            <div className='moderation-card-header-row'>
              <RatingStars rating={reviewRating} />
              <span className='moderation-card-header-meta'>{productName}</span>
            </div>
          </div>
        </div>

        <div className='moderation-card-review'>
          <div className={`moderation-card-review-comment ${this.state.expanded ? 'moderation-card-review-comment--expanded' : ''}`}>
            <p className='moderation-card-review-comment-text'>
              {reviewComment}
              <span className='moderation-card-expand-trigger' onClick={this.toggleExpansion}>
                { this.state.expanded ? 'Less' : 'More' }
              </span>
            </p>
          </div>

          <div className='moderation-card-review-footer'>
            <span className='moderation-card-review-footer-date'>{dayjs(reviewDate).format('MMMM DD, YYYY')}</span>
          </div>
        </div>

        <div className='moderation-card-response'>
          <span className='moderation-card-response-title'>Mozillian Response</span>
          <p className='moderation-card-response-comment'>{responseText}</p>
          <div className='moderation-card-response-footer'>
            <span className='moderation-card-response-footer-date'>{dayjs(responseDate).format('MMMM DD, YYYY')}</span>
          </div>
        </div>
      </div>
    )
  }

  toggleExpansion = () => this.setState({ expanded: !this.state.expanded })
}
