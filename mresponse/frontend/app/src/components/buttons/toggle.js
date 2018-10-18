import React from 'react'

import './buttons.scss'

export default class ToggleButton extends React.Component {
  state = { toggled: this.props.toggled || false }

  componentDidUpdate (prevProps) {
    if ((prevProps.toggled !== this.props.toggled) && (this.props.toggled !== this.state.toggled)) {
      this.setState({ toggled: this.props.toggled })
    }
  }

  render () {
    const { toggled } = this.state
    const { label, className, disabled = false, icon } = this.props
    return (
      <button
        className={`
          toggle-button 
          ${disabled ? 'toggle-button--disabled' : ''} 
          ${toggled ? 'toggle-button--toggled' : ''} 
          ${className}
        `}
        onClick={this.onClick}
        disabled={disabled}
      >
        { icon ? <img src={icon} className='toggle-button-icon' alt='' /> : null }
        {label}
      </button>
    )
  }

  onClick = () => this.setState(
    { toggled: !this.state.toggled },
    () => this.props.onClick(this.state.toggled)
  )
}
