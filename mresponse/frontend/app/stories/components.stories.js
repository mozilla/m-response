import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import backgroundColor from 'react-storybook-decorator-background'

import Logo from '../src/components/logo/index'
import InputField from '../src/components/input-field/index'
import LoginForm from '../src/components/login-form/index'
import HighlightedText from '../src/components/highlighted-text/index'
import StandardButton from '../src/components/buttons/index'
import SignUpForm from '../src/components/signup-form/index'
import ForgotPasswordForm from '../src/components/forgot-password-form/index'
import TagField from '../src/components/tag-field/index'
import Toolbar from '../src/components/toolbar/index'
import Avatar from '../src/components/avatar/index'
import ProgressBar from '../src/components/progress-bar'
import ResponseCard from '../src/components/response-card'

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
  .add('Input Field', () => <InputField />)
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
      productImage='/static/media/firefox.png'
    />
  ))