import React from 'react'
import './index.scss'

export default class Index extends React.Component {
	render() {
		return (
			<div className='welcome-page'>
				<img className='mozilla-logo' src='/static/media/mozilla-logo.png' alt=''/>
				<div className="page-content">
					<div className="brand-container">
						<span className="text-logo">M-Response</span>
					</div>
					<section className='info-container'>
						<p className='tagline-container'><span className='tagline'>LIKE THE IDEA OF SAVING THE WORLD FROM YOUR COUCH?</span></p>
						<span className='info-desc'>This is a new and fun tool to make it fun and easy to respond as Mozilla on Google Play store reviews</span>
					</section>
					<button className='continue-button' onClick={() => alert('clicked')}>Let's Start</button>
				</div>
				<footer>
					<span className='footer-text'>Already a contributor? <a href='#' className='footer-link'>Login</a></span>
				</footer>
			</div>
		)
	}
}