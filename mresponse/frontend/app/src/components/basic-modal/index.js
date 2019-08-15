import React from 'react'
import PropTypes from 'prop-types'

import Icon from '@components/icon'
import './basic-modal.scss'

export default class BasicModal extends React.Component {
  componentWillMount () {
    const body = document.querySelector('body')
    body.classList.add('no_scroll')
  }

  componentWillUnmount () {
    const body = document.querySelector('body')
    body.classList.remove('no_scroll')
  }

  render () {
    const { className = '', content, handleClose } = this.props

    return (
      <div className={`basic-modal ${className}`} onClick={handleClose}>
        <div className='basic-modal-close'>
          <button className="basic-modal-close-button" onClick={() => { handleClose() }}>
            <Icon iconName='close'/>
          </button>
        </div>
        <div className='basic-modal-inner' onClick={handleClose}>
          <div className='basic-modal-inner-content'>
            {content}

            <div className='basic-modal-inner-content-close'>
              <button className="basic-modal-inner-content-close-button" onClick={() => { handleClose() }}>Close</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

BasicModal.propTypes = {
  className: PropTypes.string,
  content: PropTypes.element,
  handleClose: PropTypes.func.isRequired
}
