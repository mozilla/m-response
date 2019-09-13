import React from 'react'
import dayjs from 'dayjs'

import Icon from '@components/icon'
import RatingStars from '@components/rating-stars'
import './moderate-card.scss'

export default class ModerateCard extends React.Component {
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
      productVersion,
      androidVersion,
      modCount
    } = this.props

    const reviewComment = this.state.expanded
      ? reviewText
      : reviewText.substring(0, 130) + '...'

    return (
      <div className={`moderate-card ${className}`}>
        <div className='moderate-card-main'>
          <div className='moderate-card-header'>
            <img
              className='moderate-card-header-image'
              src={productImage} alt='' />
            <div className='moderate-card-header-row-container'>
              <div className='moderate-card-header-row'>
                <span className='moderate-card-header-title'>{reviewAuthor}</span>
                <span className='moderate-card-header-meta'>Android {androidVersion}</span>
              </div>
              <div className='moderate-card-header-row'>
                <RatingStars rating={reviewRating} />
                <span className='moderate-card-header-meta'>{productName} {productVersion.name}</span>
              </div>
            </div>
          </div>

          <div className='moderate-card-review'>
            <div className={`moderate-card-review-comment ${this.state.expanded ? 'moderate-card-review-comment--expanded' : ''}`}>
              <p className='moderate-card-review-comment-text'>
                {reviewComment}
                <span className='moderate-card-expand-trigger' onClick={this.toggleExpansion}>
                  {this.state.expanded ? 'Less' : 'More'}
                </span>
              </p>
            </div>

            <div className='moderate-card-review-footer'>
              <span className='moderate-card-review-footer-date'>{dayjs(reviewDate).format('MMMM DD, YYYY')}</span>
            </div>
          </div>

          <div className='moderate-card-response'>
            <span className='moderate-card-response-title'>Mozillian Response</span>
            <p className='moderate-card-response-comment'>{responseText}</p>
            <div className='moderate-card-response-footer'>
              <span className='moderate-card-response-footer-date'>{dayjs(responseDate).format('MMMM DD, YYYY')}</span>
            </div>
          </div>
        </div>

        <div className='moderate-card-footer'>
          <div className='moderate-card-footer-modCount'>
            <div className='moderate-card-footer-modCount-item'>{modCount > 0 ? <Icon iconName='checkMark' /> : null}</div>
            <div className='moderate-card-footer-modCount-item'>{modCount >= 2 ? <Icon iconName='checkMark' /> : null}</div>
            <div className='moderate-card-footer-modCount-item'>{modCount >= 3 ? <Icon iconName='checkMark' /> : null}</div>
            <div className='moderate-card-footer-modCount-label'>Moderation count</div>
          </div>
        </div>
      </div>
    )
  }

  toggleExpansion = () => this.setState({ expanded: !this.state.expanded })
}
