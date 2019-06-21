import React from 'react'
import PropTypes from 'prop-types'

import { staticAsset } from '@utils/urls'
import './toolbar.scss'

export default class Toolbar extends React.Component {
  render () {
    const { className = '', titleClassName = '', leftComponent, rightComponent, title, onBack, backArrowClassName = '', invertBackIcon } = this.props
    return (
      <header className={`toolbar ${className}`}>
        <div className="toolbar-left">
          {leftComponent || (
            <img
              src={staticAsset('media/icons/arrow-left.svg')}
              className={`toolbar-back-link ${backArrowClassName} ${invertBackIcon ? 'toolbar-back-link--inverted' : ''}`}
              onClick={onBack}
              alt=''
            />
          )}
        </div>
        {title ? (
          <span
            className={`toolbar-title ${titleClassName}`}>
            {title}
          </span>
        ) : null}
        <div className="toolbar-right">{rightComponent}</div>
      </header>
    )
  }
}

Toolbar.propTypes = {
  leftComponent: PropTypes.element,
  rightComponent: PropTypes.element,
  title: PropTypes.string
}
