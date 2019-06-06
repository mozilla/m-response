import React from 'react'

import './leader.scss'

const Leader = ({ className, name, position, score, leader, onPodium }) =>
  <div className={
    `leader ${className || ''}
    ${onPodium ? 'leader--on-podium' : ''}
    ${leader ? 'leader--is-leader' : ''}
  `}>
    <div className="leader-avatar">
      <img className="leader-avatar-image" src="https://fillmurray.com/64/64" alt=""/>
    </div>
    <span className="leader-position">
      <span className="leader-position-number">{position}</span>
    </span>
    <span className="leader-name">{name}</span>
    <span className="leader-score">{score}</span>
  </div>

export default Leader
