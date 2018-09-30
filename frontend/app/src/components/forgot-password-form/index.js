import React from 'react'
import { Link } from 'react-router-dom'

import './forgot-form.scss'
import InputField from '../input-field'
import HighlightedText from '../highlighted-text'
import Button from '../buttons'

export default class ForgotPasswordForm extends React.Component {
	state = { status: "What's your email address?", email: '', complete: false }

	render () {
		return (
			<div className='forgot-form'>

				<h2 className='forgot-form-title'>Forgot Your Password</h2>
				<HighlightedText text={this.state.status} className='forgot-form-status' textClassName='forgot-form-status-text' />

				<form className='forgot-form-fields' onSubmit={event => this.submit(event)}>
					<InputField
						className='forgot-form-field'
						placeholder='Email'
						type='email'
						disabled={this.state.complete}
						onChange={event => this.setState({ email: event.target.value })} />
					<Button
						label='Reset'
						className='forgot-form-submit'
						disabled={!this.state.email || this.state.complete} />
				</form>
			</div>
		)
	}

	submit = event => {
		event.preventDefault()
		// DO VALIDATION HERE!!
		this.setState({ complete: true, status: "Great! Check your email for a reset link." })
		this.props.resetPassword(this.state.email)
	}

}
