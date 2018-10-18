import React from 'react'

import { staticAsset } from '@utils/urls'
import './rating-stars.scss'

export default ({ rating }) => (
  <div className='rating'>
    {Array(5).fill(0).map((item, index) => (
      <img
        src={staticAsset((index + 1 > rating) ? 'media/icons/empty-star.svg' : 'media/icons/full-star.svg')}
        className='rating-star'
        alt='' />
    ))}
  </div>
)
