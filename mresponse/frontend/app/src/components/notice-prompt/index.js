import React from 'react'

import Icon from '@components/icon'
import './notice-prompt.scss'

export default class NoticePrompt extends React.Component {
  componentWillMount () {
    const {
      closeNotice,
      data: {
        timeout = 3000
      }
    } = this.props

    if (timeout) {
      setTimeout(() => {
        closeNotice()
      }, timeout)
    }
  }

  render () {
    const {
      data: {
        message = '',
        karma,
        type = 'success'
      },
      closeNotice
    } = this.props

    return (
      <div className={`notice-prompt notice-prompt--${type}`} onClick={closeNotice}>
        <div className='notice-prompt-item notice-prompt-item-text'>
          <Icon iconName='checkMarkPlain' /><span>{message}</span>
        </div>
        {karma ? (
          <div className='notice-prompt-item notice-prompt-item-karma'>
            <Icon iconName='karma' /><span>+{karma}</span>
          </div>
        ) : null}
      </div>
    )
  }
}
