import React from 'react'
import './progress-bar.scss'

export default ({ width = 0, className, value, maxValue }) => {
<<<<<<< HEAD
  if (value != null && maxValue != null) {
    width = (value / maxValue) * 100
  }

  return (
    <div className={`progress-bar ${className}`}>
      <div className='progress-bar-inner' style={{ width: `${width}%` }} />
      <span className='progress-bar-label'>{value} / {maxValue}</span>
    </div>
  )
}
=======
    
    if (value != null && maxValue != null) {
        width = (value / maxValue) * 100
    }

    return (
        <div className={`progress-bar ${className}`}>
            <div className='progress-bar-inner' style={{ width: `${width}%` }} />
            <span className='progress-bar-label'>{value} / {maxValue}</span>
        </div>
    )
}
>>>>>>> Profile Page UI Update
