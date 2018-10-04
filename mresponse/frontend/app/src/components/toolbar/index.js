import React from 'react'
import PropTypes from 'prop-types'

import './toolbar.scss'

export default class Toolbar extends React.Component {
  render () {
    const { leftComponent, rightComponent, title, titleBackground } = this.props
    return (
      <header className="toolbar">
        <div className="toolbar-left">{leftComponent}</div>

        <img
          className="toolbar-logo"
          src="static/media/mozilla-logo.png"
          alt=""
        />
        {title ? (
          <span
            className="toolbar-page-title"
            style={{ backgroundColor: titleBackground }}
          >
            {title}
          </span>
        ) : null}

        <div className="toolbar-right">{rightComponent}</div>
      </header>
    )
  }
}

Toolbar.propTypes = {
  leftComponent: PropTypes.element.optional,
  rightComponent: PropTypes.element.optional,
  title: PropTypes.string.optional,
  titleBackground: PropTypes.string.optional
}
