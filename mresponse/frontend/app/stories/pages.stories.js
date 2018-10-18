import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import StoryRouter from 'storybook-react-router'

import WelcomePage from '../src/pages/welcome/welcome'
import LoginPage from '../src/pages/login/login'
import ProfilePage from '../src/pages/profile/profile'
import SettingsPage from '../src/pages/settings/settings'
import HomePage from '../src/pages/home/home'
import RespondPage from '../src/pages/respond/respond'
import ModeratePage from '../src/pages/moderate/moderate'

import { staticAsset } from '../src/utils/urls'
import 'normalize.css'

const profile = {
  name: 'Asa',
  picture: 'https://api.adorable.io/avatars/100/abott@adorable.png',
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
      response: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum sodales mattis. Vestibulum fermentum volutpat efficitur. In hac habitasse platea dictumst. Aliquam tincidunt in sem non gravida. Maecenas magna diam, lobortis sed bibendum id, faucibus non tortor. Aliquam euismod euismod odio, quis consequat enim malesuada vitae. Sed eget lacus at turpis hendrerit dapibus. Maecenas finibus enim a auctor viverra. Quisque maximus scelerisque consectetur.',
      date: 'September 13, 2018',
      product: {
        name: 'Firefox',
        image: staticAsset('media/firefox.png')
      }
    },
    {
      response: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum sodales mattis. Vestibulum fermentum volutpat efficitur. In hac habitasse platea dictumst. Aliquam tincidunt in sem non gravida. Maecenas magna diam, lobortis sed bibendum id, faucibus non tortor. Aliquam euismod euismod odio, quis consequat enim malesuada vitae. Sed eget lacus at turpis hendrerit dapibus. Maecenas finibus enim a auctor viverra. Quisque maximus scelerisque consectetur.',
      date: 'January 08, 2016',
      product: {
        name: 'Firefox',
        image: staticAsset('media/firefox.png')
      }
    },
    {
      response: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum sodales mattis. Vestibulum fermentum volutpat efficitur. In hac habitasse platea dictumst. Aliquam tincidunt in sem non gravida. Maecenas magna diam, lobortis sed bibendum id, faucibus non tortor. Aliquam euismod euismod odio, quis consequat enim malesuada vitae. Sed eget lacus at turpis hendrerit dapibus. Maecenas finibus enim a auctor viverra. Quisque maximus scelerisque consectetur.',
      date: 'January 08, 2016',
      product: {
        name: 'Firefox',
        image: staticAsset('media/firefox.png')
      }
    }
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
  .add('Home', () => (
    <HomePage
      profile={profile}
      updateAppConfig={() => null}
      updateHomeConfig={() => null}
      respondQueue={2000}
      moderateQueue={1000} />
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
  .add('Respond', () => (
    <RespondPage
      back={action('Go Back to dashboard')}
      review={{
        author: 'Ted Taddy',
        rating: 3,
        text: 'The script that help you predetermine or offer suggestions is full of bugs and annoying in fact delays your typing speed. This cause you to get frustrated and use simple search engine that offer no search script.. F.fox on mobile also is slow at times always snooping on your search history, delaying on response.. Well...?',
        product: {
          name: 'Firefox 59.0.2',
          image: staticAsset('media/firefox.png'),
          version: {
            name: '1.0.1'
          }
        },
        androidVersion: 'Android 7.07',
        lastModified: Date.now()
      }}
      nextReview={{
        author: 'Dave Davidson',
        rating: 1,
        text: 'The script that help you predetermine or offer suggestions is full of bugs and annoying in fact delays your typing speed. This cause you to get frustrated and use simple search engine that offer no search script.. F.fox on mobile also is slow at times always snooping on your search history, delaying on response.. Well...?',
        product: {
          name: 'Firefox 59.0.1',
          image: staticAsset('media/firefox.png'),
          version: {
            name: '1.0.1'
          }
        },
        androidVersion: 'Android 7.1',
        lastModified: Date.now()
      }}
      submitResponse={cb => null}
      fetchReview={() => true}
      fetchNewReviews={() => true}
      guideBookUrl='#'
    />
  ))
  .add('Moderate', () => (
    <ModeratePage
      back={action('Go Back to dashboard')}
      response={{
        text: 'I would like to help with organizing your bookmarks. Firefox for Android has easy bookmarking. This article will show you how to create and access your bookmarks. http://mzl.la/1PZ8VwS Please let us know if this is helpful by leaving an updated review. ',
        review: {
          author: 'Ted Taddy',
          rating: 3,
          text: 'The script that help you predetermine or offer suggestions is full of bugs and annoying in fact delays your typing speed. This cause you to get frustrated and use simple search engine that offer no search script.. F.fox on mobile also is slow at times always snooping on your search history, delaying on response.. Well...?',
          product: {
            name: 'Firefox 59.0.2',
            image: staticAsset('media/firefox.png')
          },
          androidVersion: 'Android 7.07',
          dateSubmitted: Date.now()
        }
      }}
      submitModeration={cb => null}
      fetchReview={() => true}
      fetchNewResponse={() => true}
    />
  ))
