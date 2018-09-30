import React from 'react'
import PropTypes from 'prop-types'

import './highlighted-text.scss'

const HighlightedText = ({ text, className='', textClassName='' }) => (
	<p className={`${className} highlighted-text-container`}>
		<span className={`${textClassName} highlighted-text`}>{text}</span>
	</p>
)
export default HighlightedText

HighlightedText.propTypes = {
	text: PropTypes.string.isRequired,
	className: PropTypes.string.optional,
	textClassName: PropTypes.string.optional
}
