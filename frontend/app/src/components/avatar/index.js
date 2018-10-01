import React from 'react'

import './avatar.scss'

export default ({ src, className = '', editable, onClick }) => {
	return (
		<div className={`avatar ${className}`}>
			<img className='avatar-img' src={src}/>
			{editable
				? (
					<div className='avatar-edit' onClick={() => onClick()}>
					<img className='avatar-edit-icon' src='/static/media/icons/camera.svg'/>
				</div>)
				: null
			}
		</div>
	)
}
