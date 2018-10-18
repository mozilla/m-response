import React from 'react'
import dayjs from 'dayjs'

import RatingStars from '@components/rating-stars'
import './respond-card.scss'

export default ({
  className = '',
  author,
  date,
  review,
  rating,
  productImage,
  productName,
  productVersion,
  androidVersion
}) => {
  return (
    <div className={`respond-card ${className}`}>
      <div className='respond-card-header'>
        <img
          className='respond-card-header-image'
          src={productImage} alt='' />
        <div className='respond-card-header-row-container'>
          <div className='respond-card-header-row'>
            <span className='respond-card-header-title'>{author}</span>
            <span className='respond-card-header-meta'>Android {androidVersion}</span>
          </div>
          <div className='respond-card-header-row'>
            <RatingStars rating={rating} />
            <span className='respond-card-header-meta'>{productName} {productVersion.name}</span>
          </div>
        </div>
      </div>

      <div className={`respond-card-comment`}>
        <p className='respond-card-comment-text'>{review}</p>
      </div>

      <div className='respond-card-footer'>
        <span className='respond-card-footer-date'>{dayjs(date).format('MMMM DD, YYYY')}</span>
      </div>
    </div>
  )
}
