import React from 'react'
import PropTypes from 'prop-types'

import './buttons.scss'

const Button = ({ label, onClick, className, disabled = false, icon }) => (
  <button
    className={`standard-button ${
      disabled ? 'standard-button--disabled' : null
    } ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    { icon ? <img src={icon} className='standard-button-icon' alt='' /> : null }
    {label}
  </button>
)
export default Button

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string.optional,
  disabled: PropTypes.bool.optional
}
