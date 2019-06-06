import React from 'react'
import { staticAsset } from '@utils/urls'

import './leader.scss'

const Leader = ({ className, user: { name, avatar }, position, score, onPodium }) =>
  <div className={
    `leader ${className || ''}
    ${onPodium ? 'leader--on-podium' : ''}
  `}>
    <div className="leader-avatar">
      <img
        className={`leader-avatar-image ${!avatar ? 'leader-avatar-image--fallback' : ''}`}
        src={avatar || staticAsset('media/icons/user.svg')}
        alt=''
      />
    </div>
    <span className="leader-position">
      <span className="leader-position-number">{position}</span>
    </span>
    <span className="leader-name">{name}</span>
    <span className="leader-score">{score}</span>
  </div>

export default Leader
