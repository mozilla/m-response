import React from 'react'
import PropTypes from 'prop-types'

import './field.scss'

export default class InputField extends React.Component {
  state = { focused: false }

  render () {
    const { focused } = this.state
    const {
      className,
      icon,
      placeholder,
      value,
      onChange,
      type = 'text',
      disabled
    } = this.props
    return (
      <div
        className={`form-field-outer ${className} ${
          focused ? 'form-field-outer--shifted' : ''
        }`}
      >
        <div
          className={`form-field-inner ${
            focused ? 'form-field-inner--shifted' : ''
          }`}
        >
          <img
            className="form-field-icon"
            src={icon || 'static/media/icons/email.svg'}
            alt=""
          />
          <input
            placeholder={placeholder || 'Email'}
            className="form-field-input"
            disabled={disabled}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => this.toggleFocus()}
            onBlur={() => this.toggleFocus()}
          />
        </div>
      </div>
    )
  }

  toggleFocus = () =>
    this.setState(
      {
        focused: !this.state.focused
      },
      () => (this.props.onFocus ? this.props.onFocus() : null)
    )
}

InputField.propTypes = {
  className: PropTypes.string.optional,
  icon: PropTypes.string.optional,
  placeholder: PropTypes.string.optional,
  type: PropTypes.string.optional,
  value: PropTypes.string.optional,
  onChange: PropTypes.func.optional,
  onFocus: PropTypes.func.optional,
  disabled: PropTypes.bool.optional
}
