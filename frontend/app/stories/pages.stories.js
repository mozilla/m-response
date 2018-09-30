import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import StoryRouter from 'storybook-react-router'

import WelcomePage from '../src/pages/welcome/welcome'
import LoginPage from '../src/pages/login/login'

storiesOf('Pages', module)
	.addDecorator(StoryRouter())
	.add('Welcome', () =>
		<WelcomePage
			continue={action('Go to SignUp page')}
			login={action('Go to Login page')}
		/>
	)
	.add('Login', () =>
		<LoginPage
			back={action('Go back to Welcome page')}
			login={action('Login')}
			createAccount={action('Create Account')}
			forgotPassword={action('Forgot Password')}
		/>
	)

