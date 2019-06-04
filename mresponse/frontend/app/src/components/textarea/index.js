import React from 'react'
import PropTypes from 'prop-types'

import './textarea.scss'

export default class Textarea extends React.Component {
  render () {
    const {
      placeholder,
      value,
      onChange,
      disabled,
      rows = 3,
      maxLength
    } = this.props
    return (
      <textarea
        placeholder={placeholder || 'Add your response'}
        className={`form-field-textarea`}
        disabled={disabled}
        value={value}
        rows={rows}
        onChange={onChange}
        { ...(maxLength && { maxLength: maxLength }) }
      />
    )
  }
}

Textarea.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  disabled: PropTypes.bool,
  maxLength: PropTypes.int
}
