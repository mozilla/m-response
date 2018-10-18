import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import backgroundColor from 'react-storybook-decorator-background'

import Logo from '../src/components/logo/index'
import InputField from '../src/components/input-field/index'
import LoginForm from '../src/components/login-form/index'
import HighlightedText from '../src/components/highlighted-text/index'
import StandardButton from '../src/components/buttons/index'
import ToggleButton from '../src/components/buttons/toggle'
import SignUpForm from '../src/components/signup-form/index'
import ForgotPasswordForm from '../src/components/forgot-password-form/index'
import TagField from '../src/components/tag-field/index'
import Toolbar from '../src/components/toolbar/index'
import Avatar from '../src/components/avatar/index'
import ProgressBar from '../src/components/progress-bar'
import ResponseCard from '../src/components/response-card'
import HomePageCard from '../src/components/home-page-card'
import RespondCard from '../src/components/respond-card'
import ModerateCard from '../src/components/moderate-card'
import RatingStars from '../src/components/rating-stars'
import AlertPrompt from '../src/components/alert-prompt'
import { staticAsset } from '../src/utils/urls'

storiesOf('Components', module)
  .addDecorator(backgroundColor(['#24172A', '#ffffff', '#dcdde1', '#000000']))
  .add('Logo', () => <Logo />)
  .add('Toolbar', () => (
    <Toolbar title="Responder Mode" titleBackground="#57ddc4" />
  ))
  .add('Avatar', () => (
    <Avatar
      src="https://api.adorable.io/avatars/100/abott@adorable.png"
      editable={true}
      onClick={action('Change Avatar')}
    />
  ))
  .add('Input Field', () => <InputField icon={staticAsset('media/icons/email.svg')} />)
  .add('Tag Field', () => (
    <TagField
      suggestions={[
        { id: 'EN', text: 'English' },
        { id: 'ES', text: 'Spanish' },
        { id: 'FR', text: 'French' },
        { id: 'RU', text: 'Russian' }
      ]}
    />
  ))
  .add('Highlighted Text', () => <HighlightedText text="Test Text" />)
  .add('Button', () => (
    <StandardButton label="Test Button" onClick={action('Button Press!')} />
  ))
  .add('Toggle Button', () => (
    <ToggleButton
      label="Test Button"
      onClick={action('Toggle Press!')}
      icon={staticAsset('media/icons/smile.svg')} />
  ))
  .add('Login Form', () => (
    <LoginForm
      login={action('Login with details')}
      forgotPassword={action('Forgot Password')}
    />
  ))
  .add('Signup Form', () => (
    <SignUpForm
      login={action('Login with details')}
      forgotPassword={action('Forgot Password')}
    />
  ))
  .add('Forgot Password Form', () => (
    <ForgotPasswordForm resetPassword={action('Forgot Password')} />
  ))
  .add('Progress Bar', () => (
    <ProgressBar value={90} />
  ))
  .add('Response Card', () => (
    <ResponseCard
      response='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum sodales mattis. Vestibulum fermentum volutpat efficitur. In hac habitasse platea dictumst. Aliquam tincidunt in sem non gravida. Maecenas magna diam, lobortis sed bibendum id, faucibus non tortor. Aliquam euismod euismod odio, quis consequat enim malesuada vitae. Sed eget lacus at turpis hendrerit dapibus. Maecenas finibus enim a auctor viverra. Quisque maximus scelerisque consectetur.'
      date='January 08, 2016'
      productName='Firefox'
      productImage={staticAsset('media/firefox.png')}
    />
  ))
  .add('Home Page Card', () => (
    <HomePageCard
      title='Respond'
      icon={staticAsset('media/icons/message.svg')}
      subtitle='Queue: 31,240' />
  ))
  .add('Respond Card', () => (
    <RespondCard
      author='Tesh Taddy'
      date={Date.now()}
      review='The script that help you predetermine or offer suggestions is full of bugs and annoying in fact delays your typing speed. This cause you to get frustrated and use simple search engine that offer no search script.. F.fox on mobile also is slow at times always snooping on your search history, delaying on response.. Well...?'
      rating={3}
      productName='Firefox 59.0.2'
      productImage={staticAsset('media/firefox.png')}
      androidVersion='Android 7.07'
    />
  ))
  .add('Moderate Card', () => (
    <ModerateCard
      reviewAuthor='Tesh Taddy'
      reviewDate={Date.now()}
      reviewText='The script that help you predetermine or offer suggestions is full of bugs and annoying in fact delays your typing speed. This cause you to get frustrated and use simple search engine that offer no search script.. F.fox on mobile also is slow at times always snooping on your search history, delaying on response.. Well...?'
      reviewRating={3}
      responseText='I would like to help with organizing your bookmarks. Firefox for Android has easy bookmarking. This article will show you how to create and access your bookmarks. http://mzl.la/1PZ8VwS Please let us know if this is helpful by leaving an updated review. '
      responseDate={Date.now()}
      productName='Firefox 59.0.2'
      productImage={staticAsset('media/firefox.png')}
      androidVersion='Android 7.07'
    />
  ))
  .add('Rating Stars', () => <RatingStars rating={3} />)
  .add('Alert Prompt', () => (
    <AlertPrompt
      title='Submitted'
      message='Thank you for your effort and so making Mozilla better for all of us!'/>
  ))
