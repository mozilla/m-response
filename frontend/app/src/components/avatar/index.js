import React from 'react'
import PropTypes from 'prop-types'

import './avatar.scss'

const Avatar = ({ src, className = '', editable, onClick }) => {
  return (
    <div className={`avatar ${className}`}>
      <img className="avatar-img" src={src} />
      {editable ? (
        <div className="avatar-edit" onClick={() => onClick()}>
          <img
            className="avatar-edit-icon"
            src="/static/media/icons/camera.svg"
          />
        </div>
      ) : null}
    </div>
  )
}

Avatar.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string.optional,
  editable: PropTypes.bool.optional,
  onClick: PropTypes.bool.optional
}

export default Avatar
