import React from 'react'
import PropTypes from 'prop-types'

export default class Icon extends React.Component {
  render () {
    const { className = '', iconName = '' } = this.props
    let icon = ''
    switch (iconName) {
      case 'respond':
        icon = <svg className={className} width='20' height='20' viewBox='0 0 20 20' xmlnsXlink='http://www.w3.org/2000/svg' xlink='http://www.w3.org/1999/xlink' fill='currentColor'>
          <path d='M17 0H3C1.3 0 0 1.3 0 3v16c0 .4.2.8.6.9.1.1.3.1.4.1.3 0 .5-.1.7-.3L5.4 16H17c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3zm1 13c0 .6-.4 1-1 1H5c-.3 0-.5.1-.7.3L2 16.6V3c0-.6.4-1 1-1h14c.6 0 1 .4 1 1v10z' fillRule='nonzero'/>
          <circle fillRule='nonzero' cx='10' cy='8' r='1'/>
          <circle fillRule='nonzero' cx='14' cy='8' r='1'/>
          <circle fillRule='nonzero' cx='6' cy='8' r='1'/>
        </svg>
        break
      case 'moderate':
        icon = (
          <svg width='18' height='22' viewBox='0 0 18 22' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' fill='currentColor' className={className}>
            <path d='M15 2h-1c0-1.1-.9-2-2-2H6C4.9 0 4 .9 4 2H3C1.3 2 0 3.3 0 5v14c0 1.7 1.3 3 3 3h12c1.7 0 3-1.3 3-3V5c0-1.7-1.3-3-3-3zM6 2h6v2H6V2zm10 17c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V5c0-.6.4-1 1-1h1c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2h1c.6 0 1 .4 1 1v14z' fillRule='nonzero'/>
            <path d='M4 9h10v1H4V9zm0 3h10v1H4v-1zm0 3h10v1H4v-1z' fillRule='nonzero'/>
          </svg>
        )
        break
      case 'close':
        icon = (
          <svg width='14' height='14' viewBox='0 0 14 14' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' fill='currentColor' className={className}>
            <path id='a' d='M13.7 12.3c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3L7 8.4l-5.3 5.3c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4L5.6 7 .3 1.7C-.1 1.3-.1.7.3.3c.4-.4 1-.4 1.4 0L7 5.6 12.3.3c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L8.4 7l5.3 5.3z'/>
          </svg>
        )
        break
      case 'copy':
        icon = (
          <svg xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' className={className}>
            <rect x='9' y='9' width='13' height='13' rx='2' ry='2'/>
            <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'/>
          </svg>
        )
        break
      case 'help':
        icon = (
          <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='currentColor' className={className}>
            <path d='M8 1a7 7 0 1 0 7 7 7.008 7.008 0 0 0-7-7zm0 13a6 6 0 1 1 6-6 6.007 6.007 0 0 1-6 6zM8 3.125A2.7 2.7 0 0 0 5.125 6a.875.875 0 1 0 1.75 0c0-1 .6-1.125 1.125-1.125.502-.039.967.267 1.13.744a.894.894 0 0 1-.53 1.016A2.738 2.738 0 0 0 7.125 9v.337a.875.875 0 1 0 1.75 0v-.37c.044-.362.276-.675.609-.824A2.637 2.637 0 0 0 10.82 5.16 2.838 2.838 0 0 0 8 3.125zm0 7.625a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5z'/>
          </svg>
        )
        break
      case 'helpFolder':
        icon = (
          <svg className={className} xmlns='http://www.w3.org/2000/svg' width='83' height='77'>
            <path fill='currentColor' d='M60.308 10.989l-24.012 6.434-8.054-4.329a8.463 8.463 0 0 0-6.2-.726L8.827 15.91c-4.534 1.215-7.217 5.907-5.992 10.48l11.092 41.396c1.226 4.573 5.895 7.295 10.43 6.08l49.261-13.2c4.535-1.215 7.218-5.907 5.992-10.48l-8.874-33.117c-1.225-4.572-5.894-7.294-10.428-6.08z'/>
            <path fill='#FFF' d='M47.882 56.489c-8.002 2.144-16.227-2.605-18.37-10.607-2.145-8.002 2.604-16.227 10.606-18.37 8.002-2.145 16.227 2.604 18.37 10.606 2.135 8-2.61 16.218-10.606 18.37zm-6.515-24.314a5.633 5.633 0 0 0-4.241 7.347 1.826 1.826 0 0 0 3.527-.945c-.54-2.016.601-2.592 1.66-2.875a2.306 2.306 0 0 1 2.679.89 1.865 1.865 0 0 1-.52 2.333 5.713 5.713 0 0 0-1.695 5.563l.182.68a1.826 1.826 0 0 0 3.526-.946l-.2-.746a2.174 2.174 0 0 1 .783-1.99 5.502 5.502 0 0 0 1.082-6.733 5.921 5.921 0 0 0-6.783-2.578zm4.118 15.367a2.608 2.608 0 1 0 1.35 5.039 2.608 2.608 0 0 0-1.35-5.039z'/>
          </svg>
        )
        break
      case 'sideBar':
        icon = (
          <svg className={className} xmlns='http://www.w3.org/2000/svg' width='16' height='14' viewBox='0 0 16 14' fill='currentColor'>
            <path d='M13 0H3a3.007 3.007 0 0 0-3 3v8a3.009 3.009 0 0 0 3 3h10a3.005 3.005 0 0 0 3-3V3a3.012 3.012 0 0 0-3-3zM2 11V3a1 1 0 0 1 1-1h5v10H3a1 1 0 0 1-1-1zm12 0a1 1 0 0 1-1 1H9V2h4a1 1 0 0 1 1 1v8z'/>
            <path d='M12.5 4h-2a.5.5 0 1 1 0-1h2a.5.5 0 1 1 0 1zm0 2h-2a.5.5 0 1 1 0-1h2a.5.5 0 1 1 0 1zm-1 2h-1a.5.5 0 1 1 0-1h1a.5.5 0 1 1 0 1z'/>
          </svg>
        )
        break
      case 'openInNew':
        icon = (
          <svg className={className} xmlns='http://www.w3.org/2000/svg' width='12' height='11' viewBox='0 0 12 11' fill='currentColor'>
            <path d='M3.143 0h-.786A2.357 2.357 0 0 0 0 2.357v6.286A2.357 2.357 0 0 0 2.357 11h6.286A2.357 2.357 0 0 0 11 8.643v-.786a.786.786 0 0 0-1.571 0v.786a.786.786 0 0 1-.786.786H2.357a.786.786 0 0 1-.786-.786V2.357c0-.434.352-.786.786-.786h.786a.786.786 0 1 0 0-1.571z'/>
            <path d='M10.95.486A.786.786 0 0 0 10.223 0H6.295a.786.786 0 1 0 0 1.571h2.032L5.74 4.16a.786.786 0 1 0 1.11 1.11l2.588-2.587v2.032a.786.786 0 1 0 1.572 0V.786a.786.786 0 0 0-.06-.3z'/>
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
