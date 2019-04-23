import React from 'react'

import './buttons.scss'

const ToggleButton = ({ label, className, disabled = false, icon, toggled, handleClick }) => {
  return (
    <button
      className={`
        toggle-button
        ${disabled ? 'toggle-button--disabled' : ''}
        ${toggled ? 'toggle-button--toggled' : ''}
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled}
    >
      { icon ? <img src={icon} className='toggle-button-icon' alt='' /> : null }
      {label}
    </button>
  )
}

export default ToggleButton
