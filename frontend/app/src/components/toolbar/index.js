import React from 'react'

import './toolbar.scss'
import { LOGIN_URL } from '../../utils/urls'

export default class Toolbar extends React.Component {
	render() {
		const { leftComponent, rightComponent, title, titleBackground } = this.props
		return (
			<header className='toolbar'>

					<div className='toolbar-left'>
						{leftComponent}
					</div>

					<img className='toolbar-logo' src='/static/media/mozilla-logo.png'/>
					{title ? <span className='toolbar-page-title' style={{ backgroundColor: titleBackground }}>{title}</span> : null}

					<div className="toolbar-right">
						{rightComponent}
					</div>

			</header>
		)
	}
}
