import React from 'react'
import PropTypes from 'prop-types'

import './toolbar.scss'

export default class Toolbar extends React.Component {
  render () {
    const { leftComponent, rightComponent, title } = this.props
    return (
      <header className="toolbar">
        <div className="toolbar-left">{leftComponent}</div>
        {title ? (
          <span
            className="toolbar-title">
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
  title: PropTypes.string.optional
}
