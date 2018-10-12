import React from 'react'
import PropTypes from 'prop-types'

import { staticAsset } from '@utils/urls'
import './avatar.scss'

const Avatar = ({ src, coverIcon, className = '', editable, onClick, karma }) => {
  return (
    <div className={`avatar ${className}`}>
      <img className="avatar-img" src={src} alt="" />
      {editable || coverIcon ? (
        <div className="avatar-cover" onClick={onClick}>
          <img
            className="avatar-cover-icon"
            src={coverIcon || staticAsset('media/icons/camera.svg')}
            alt=""
          />
        </div>
      ) : null}
      {karma != null
        ? (
          <div className='avatar-karma'>
            <img
              src={staticAsset('media/icons/karma.svg')}
              className='avatar-karma-icon' />
            <span className='avatar-karma-value'>{karma}</span>
          </div>
        ) : null}
    </div>
  )
}

Avatar.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string.optional,
  editable: PropTypes.bool.optional,
  onClick: PropTypes.bool.optional,
  coverIcon: PropTypes.string.optional,
  karma: PropTypes.string.optional
}

export default Avatar
