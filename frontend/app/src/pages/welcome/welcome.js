import React from 'react'
import './welcome.scss'

import Logo from '../../components/logo'
import HighlightedText from '../../components/highlighted-text'
import Button from '../../components/buttons'

export default class WelcomePage extends React.Component {
	render() {
		return (
			<div className='welcome-page'>
				<img className='mozilla-logo' src='/static/media/mozilla-logo.png' alt=''/>
				<div className="page-content">
					<div className="brand-container">
						<Logo className='logo-foo'/>
						<span className="text-logo">M-Response</span>
					</div>
					<section className='info-container'>
						<HighlightedText textClassName='tagline' text='LIKE THE IDEA OF SAVING THE WORLD FROM YOUR COUCH?'/>
						<span className='info-desc'>This is a new and fun tool to make it fun and easy to respond as Mozilla on Google Play store reviews</span>
					</section>
					<Button
						label="Let's Start"
						className='continue-button'
						onClick={this.props.continue} />
				</div>
				<footer>
					<span className='footer-text'>
						Already a contributor? <span onClick={this.props.login} className='footer-link'>Login</span>
					</span>
				</footer>
			</div>
		)
	}
}
