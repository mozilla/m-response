import React from 'react'

import './card.scss'

export default ({ title, subtitle, footer, icon, bgColor, onClick, disabled }) => (
  <div className={`home-page-card${bgColor ? ' home-page-card-bg-' + bgColor : ''}`} onClick={onClick}>
    <div
      className='home-page-card-dot'>
      <img
        src={icon}
        className='home-page-card-dot-image'
        alt='' />
    </div>
    <span className='home-page-card-title'>{title}</span>
    {subtitle
      ? <span className='home-page-card-subtitle'>{subtitle}</span>
      : null}
    {footer}
  </div>
)
