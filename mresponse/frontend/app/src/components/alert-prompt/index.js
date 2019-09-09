import React from 'react'

import { staticAsset } from '@utils/urls'
import './alert-prompt.scss'

export default class AlertPrompt extends React.Component {
    state = { dismissed: false }

    componentDidMount () {
      if (!this.props.isError) {
        this.setHideTimeout()
      }
    }

    setHideTimeout () {
      setTimeout(function () {
        this.setState({ dismissed: true })
      }.bind(this), 5000)
    }

    render () {
      const { dismissed } = this.state
      const { className = '', title, message, isError } = this.props
      return (
        <div className={`
          alert-prompt 
          ${dismissed ? 'alert-prompt--dismissed' : ''}
          ${isError ? 'alert-prompt--error' : ''}
          ${className} 
        `}>
          <div className='alert-prompt-header'>
            <span className='alert-prompt-header-title'>
              { isError
                ? null
                : <img className='alert-prompt-header-title-icon' src={staticAsset('media/icons/check_circle.svg')} alt='' />
              }
              { title }
            </span>
            <img
              className='alert-prompt-header-close'
              src={staticAsset('media/icons/close.svg')}
              onClick={this.dismissAlert}
              alt='' />
          </div>
          <span className='alert-prompt-message'>{ message }</span>
        </div>
      )
    }

    dismissAlert = () => this.setState({ dismissed: true })
}
