import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import backgroundColor from 'react-storybook-decorator-background'

import Logo from '../src/components/logo'
import InputField from '../src/components/input-field'
import LoginForm from '../src/components/login-form'
import HighlightedText from '../src/components/highlighted-text'
import StandardButton from '../src/components/buttons'
import SignUpForm from '../src/components/signup-form'
import ForgotPasswordForm from '../src/components/forgot-password-form'
import TagField from '../src/components/tag-field'

storiesOf('Components', module)
	.addDecorator(backgroundColor(['#24172A', '#ffffff', '#dcdde1', '#000000']))
	.add('Logo', () => <Logo/>)
	.add('Input Field', () => <InputField/>)
	.add('Tag Field', () => <TagField
		suggestions={[
			{ id: 'English', text: 'English' },
			{ id: 'Spanish', text: 'Spanish' },
			{ id: 'French', text: 'French' },
			{ id: 'Russian', text: 'Russian' },
			{ id: 'Latin', text: 'Latin' },
		]}/>)
	.add('Highlighted Text', () => <HighlightedText text='Test Text'/>)
	.add('Button', () => <StandardButton label='Test Button' onClick={action('Button Press!')}/>)
	.add('Login Form', () => <LoginForm login={action('Login with details')} forgotPassword={action('Forgot Password')}/>)
	.add('Signup Form', () => <SignUpForm login={action('Login with details')}
																				forgotPassword={action('Forgot Password')}/>)
	.add('Forgot Password Form', () => <ForgotPasswordForm resetPassword={action('Forgot Password')}/>)

