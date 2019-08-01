import React from 'react'
import PropTypes from 'prop-types'

// import { staticAsset } from '@utils/urls'
import Toolbar from '@components/toolbar'
// import Button from '@components/buttons'
import Icon from '@components/icon'
import './side-bar.scss'

export default class SideBar extends React.Component {
  componentWillMount () {
    const body = document.querySelector('body')
    body.classList.add('no_scroll')
  }

  componentWillUnmount () {
    const body = document.querySelector('body')
    body.classList.remove('no_scroll')
  }

  render () {
    const { className = '', title, content, handleClose, handleCloseOffWindow } = this.props
    const closeIcon = (
      <button className="side-bar-close-button" onClick={handleClose}>
        <Icon iconName='close'/>
      </button>
    )
    return (
      <div className={`side-bar ${className}`} onClick={handleCloseOffWindow}>
        <div className='side-bar-inner'>
          <Toolbar
            className='side-bar-toolbar'
            title={title}
            leftComponent={true}
            rightComponent={closeIcon} />
          {content}
        </div>
      </div>
    )
  }
}

SideBar.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  content: PropTypes.element,
  handleClose: PropTypes.func.isRequired
}
