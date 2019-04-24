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
          {icon
            ? <img
              className="form-field-icon"
              src={icon}
              alt=""
            /> : null}
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
  className: PropTypes.string,
  icon: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  disabled: PropTypes.bool
}
