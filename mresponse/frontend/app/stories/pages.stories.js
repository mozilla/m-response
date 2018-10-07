import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import StoryRouter from 'storybook-react-router'

import WelcomePage from '../src/pages/welcome/welcome'
import LoginPage from '../src/pages/login/login'
import ProfilePage from '../src/pages/profile/profile'
import SettingsPage from '../src/pages/settings/settings'

import 'normalize.css'

const profile = {
  name: 'Asa',
  avatar: 'https://api.adorable.io/avatars/100/abott@adorable.png',
  email: 'Asa@mozilla.com',
  languages: [
    { id: 'EN', text: 'English' },
    { id: 'ES', text: 'Spanish' }
  ],
  karma: {
    responses: {
      karmaValue: 345,
      responsesCount: 245
    },
    moderations: {
      karmaValue: 700,
      moderationsCount: 100
    }
  },
  responses: [
    { 
      response: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum sodales mattis. Vestibulum fermentum volutpat efficitur. In hac habitasse platea dictumst. Aliquam tincidunt in sem non gravida. Maecenas magna diam, lobortis sed bibendum id, faucibus non tortor. Aliquam euismod euismod odio, quis consequat enim malesuada vitae. Sed eget lacus at turpis hendrerit dapibus. Maecenas finibus enim a auctor viverra. Quisque maximus scelerisque consectetur.' ,
      date: 'September 13, 2018',
      product: {
        name: 'Firefox',
        image: '/static/media/firefox.png'
      }
    },
    { 
      response: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum sodales mattis. Vestibulum fermentum volutpat efficitur. In hac habitasse platea dictumst. Aliquam tincidunt in sem non gravida. Maecenas magna diam, lobortis sed bibendum id, faucibus non tortor. Aliquam euismod euismod odio, quis consequat enim malesuada vitae. Sed eget lacus at turpis hendrerit dapibus. Maecenas finibus enim a auctor viverra. Quisque maximus scelerisque consectetur.' ,
      date: 'January 08, 2016',
      product: {
        name: 'Firefox',
        image: '/static/media/firefox.png'
      }
    },
    { 
      response: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum sodales mattis. Vestibulum fermentum volutpat efficitur. In hac habitasse platea dictumst. Aliquam tincidunt in sem non gravida. Maecenas magna diam, lobortis sed bibendum id, faucibus non tortor. Aliquam euismod euismod odio, quis consequat enim malesuada vitae. Sed eget lacus at turpis hendrerit dapibus. Maecenas finibus enim a auctor viverra. Quisque maximus scelerisque consectetur.' ,
      date: 'January 08, 2016',
      product: {
        name: 'Firefox',
        image: '/static/media/firefox.png'
      }
    },
  ]
}

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
      profile={profile}
    />
  ))
  .add('Settings', () => (
    <SettingsPage
      logout={action('Logout')}
      back={action('Go Back to dashboard')}
      saveProfile={action('Save & Go back')}
      profile={profile}
    />
  ))
