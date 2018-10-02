import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import StoryRouter from 'storybook-react-router'

import WelcomePage from '../src/pages/welcome/welcome'
import LoginPage from '../src/pages/login/login'
import ProfilePage from '../src/pages/profile/profile'
import SettingsPage from '../src/pages/settings/settings'

storiesOf('Pages', module)
  .addDecorator(StoryRouter())
  .add('Welcome', () => (
    <WelcomePage
      continue={action('Go to SignUp page')}
      login={action('Go to Login page')}
    />
  ))
  .add('Login', () => (
    <LoginPage
      back={action('Go back to Welcome page')}
      login={action('Login')}
      createAccount={action('Create Account')}
      forgotPassword={action('Forgot Password')}
    />
  ))
  .add('Profile', () => (
    <ProfilePage
      logout={action('Logout')}
      back={action('Go Back to dashboard')}
      editProfile={action('Go to settings page')}
      profile={{
        name: 'Asa',
        avatar: 'https://api.adorable.io/avatars/100/abott@adorable.png',
        karma: {
          responses: {
            karmaValue: 345,
            responsesCount: 245
          },
          moderations: {
            karmaValue: 700,
            moderationsCount: 100
          }
        }
      }}
    />
  ))
  .add('Settings', () => (
    <SettingsPage
      logout={action('Logout')}
      back={action('Go Back to dashboard')}
      saveProfile={action('Save & Go back')}
      profile={{
        name: 'Asa',
        avatar: 'https://api.adorable.io/avatars/100/abott@adorable.png',
        email: 'Asa@mozilla.com',
        languages: [
          { id: 'english', text: 'English' },
          { id: 'french', text: 'French' },
          { id: 'spanish', text: 'Spanish' }
        ]
      }}
    />
  ))
