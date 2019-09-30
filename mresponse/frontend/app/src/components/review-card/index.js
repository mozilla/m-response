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

    const shortRespText = responseText.length > 140 ? responseText.slice(0, 136) + '...' : responseText

    return (
      <button className={`review-card ${className}`} onClick={onClick}>
        <div className='review-card-response'>
          <p className='review-card-response-comment'>{shortRespText}</p>
        </div>
        <div className='review-card-footer'>
          <div className='review-card-footer-modCount'>
            <div className='review-card-footer-modCount-item'>{modCount > 0 ? <Icon iconName='checkMark' /> : null}</div>
            <div className='review-card-footer-modCount-item'>{modCount >= 2 ? <Icon iconName='checkMark' /> : null}</div>
            <div className='review-card-footer-modCount-item'>{modCount >= 3 ? <Icon iconName='checkMark' /> : null}</div>
            <div className='review-card-footer-modCount-label'>Moderation count</div>
            <div className='review-card-footer-modCount-karma'>
              <div className='review-card-footer-modCount-karma-inner'>
                <Icon iconName='karma' /><span>{modCount + 1}</span>
              </div>
            </div>
          </div>
        </div>
      </button>
    )
  }
}
