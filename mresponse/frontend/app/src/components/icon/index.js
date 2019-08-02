import React from 'react'
import PropTypes from 'prop-types'

export default class Icon extends React.Component {
  render () {
    const { className = '', iconName = '' } = this.props
    let icon = ''
    switch (iconName) {
      case 'respond':
        icon = <svg className={className} width="20" height="20" viewBox="0 0 20 20" xmlnsXlink="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" fill="currentColor">
          <path d="M17 0H3C1.3 0 0 1.3 0 3v16c0 .4.2.8.6.9.1.1.3.1.4.1.3 0 .5-.1.7-.3L5.4 16H17c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3zm1 13c0 .6-.4 1-1 1H5c-.3 0-.5.1-.7.3L2 16.6V3c0-.6.4-1 1-1h14c.6 0 1 .4 1 1v10z" fillRule="nonzero"/>
          <circle fillRule="nonzero" cx="10" cy="8" r="1"/>
          <circle fillRule="nonzero" cx="14" cy="8" r="1"/>
          <circle fillRule="nonzero" cx="6" cy="8" r="1"/>
        </svg>
        break
      case 'moderate':
        icon = (
          <svg width="18" height="22" viewBox="0 0 18 22" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="currentColor">
            <path d="M15 2h-1c0-1.1-.9-2-2-2H6C4.9 0 4 .9 4 2H3C1.3 2 0 3.3 0 5v14c0 1.7 1.3 3 3 3h12c1.7 0 3-1.3 3-3V5c0-1.7-1.3-3-3-3zM6 2h6v2H6V2zm10 17c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V5c0-.6.4-1 1-1h1c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2h1c.6 0 1 .4 1 1v14z" fillRule="nonzero"/>
            <path d="M4 9h10v1H4V9zm0 3h10v1H4v-1zm0 3h10v1H4v-1z" fillRule="nonzero"/>
          </svg>
        )
        break
      case 'close':
        icon = (
          <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="currentColor">
            <path id="a" d="M13.7 12.3c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3L7 8.4l-5.3 5.3c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4L5.6 7 .3 1.7C-.1 1.3-.1.7.3.3c.4-.4 1-.4 1.4 0L7 5.6 12.3.3c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L8.4 7l5.3 5.3z"/>
          </svg>
        )
        break
      case 'copy':
        icon = (
          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
        )
        break
      default:
        break
    }
    return icon
  }
}

Icon.propTypes = {
  className: PropTypes.string,
  iconName: PropTypes.string
}
