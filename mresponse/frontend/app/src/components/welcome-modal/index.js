import React from 'react'
import PropTypes from 'prop-types'

// import { staticAsset } from '@utils/urls'
import Button from '@components/buttons'
import Icon from '@components/icon'
import './welcome-modal.scss'

export default class WelcomeModal extends React.Component {
  componentWillMount () {
    const body = document.querySelector('body')
    body.classList.add('no_scroll')
  }

  componentWillUnmount () {
    const body = document.querySelector('body')
    body.classList.remove('no_scroll')
  }

  render () {
    const { className = '', title, text, forPage, handleClose } = this.props
    return (
      <div className={`welcome-modal ${className} welcome-modal--for-${forPage}`}>
        <div className='welcome-modal-inner'>
          <div className='welcome-modal-icon'>
            <div className='welcome-modal-icon-inner'>
              <Icon iconName={forPage}></Icon>
            </div>
          </div>
          <div className='welcome-modal-intro'>
            <h1>{title}</h1>
            <p>{text}</p>
          </div>
          <div className='welcome-modal-instructions'>
            <p>The critiera for a hight quality response is:</p>
            <ol>
              <li>A friendly tone</li>
              <li>Technical accuracy</li>
              <li>High reuse value</li>
            </ol>
          </div>
          <div className='welcome-modal-close-wrap'>
            <Button
              label="Let's start!"
              onClick={handleClose}
            ></Button>
          </div>
          <div className='welcome-modal-more-details'>
            <Button
              type='link'
              label="Learn more about response criteria"
              onClick={handleClose}
            ></Button>
          </div>
        </div>
      </div>
    )
  }
}

WelcomeModal.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  forPage: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired
}
