import React from 'react'

import Icon from '@components/icon'
import './review-card.scss'

export default class ReviewCard extends React.Component {
  render () {
    const {
      className = '',
      responseText,
      modCount,
      onClick
    } = this.props

    return (
      <button className={`review-card ${className}`} onClick={onClick}>
        <div className='review-card-response'>
          <p className='review-card-response-comment'>{responseText}</p>
        </div>
        <div className='review-card-footer'>
          <div className='review-card-footer-modCount'>
            <div className='review-card-footer-modCount-item'>{modCount > 0 ? <Icon iconName='checkMark' /> : null}</div>
            <div className='review-card-footer-modCount-item'>{modCount >= 2 ? <Icon iconName='checkMark' /> : null}</div>
            <div className='review-card-footer-modCount-item'>{modCount >= 3 ? <Icon iconName='checkMark' /> : null}</div>
            <div className='review-card-footer-modCount-label'>Moderation count</div>
          </div>
        </div>
      </button>
    )
  }
}
