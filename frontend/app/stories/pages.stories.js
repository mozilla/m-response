import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import WelcomePage from '../src/pages/index'

storiesOf('Pages', module)
	.add('Welcome Page', () => <WelcomePage />)
