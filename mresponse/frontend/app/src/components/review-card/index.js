import React from 'react'

import Icon from '@components/icon'
import './review-card.scss'

export default class ReviewCard extends React.Component {
  state = { expanded: false }

  render () {
    const {
      className = '',
      responseText,
      modCount,
      onClick
    } = this.props

    const resText = responseText.length < 130
      ? responseText
      : responseText.substring(0, 130) + '...'

    return (
      <button className={`review-card ${className}`} onClick={onClick}>
        <div className='review-card-response'>
          <p className='review-card-response-comment'>{resText}</p>
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

  toggleExpansion = () => this.setState({ expanded: !this.state.expanded })
}
