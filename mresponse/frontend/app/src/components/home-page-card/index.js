import React from 'react'

import './card.scss'

export default ({ title, subtitle, footer, icon, dotColor = '#0a84ff', onClick, disabled }) => (
  <div className='home-page-card'>
    <div
      className='home-page-card-dot'
      style={{ backgroundColor: dotColor }}>
      <img
        src={icon}
        className='home-page-card-dot-image' />
    </div>
    <span className='home-page-card-title'>{title}</span>
    {subtitle
      ? <span className='home-page-card-subtitle'>{subtitle}</span>
      : null}
    {footer}
  </div>
)
