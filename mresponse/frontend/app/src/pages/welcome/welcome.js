import React from 'react'
import PropTypes from 'prop-types'

import Button from '@components/buttons'
import DecomBanner from '@components/decom-banner'
import { staticAsset, DASHBOARD_URL } from '@utils/urls'
import './welcome.scss'

export default class WelcomePage extends React.Component {
  constructor (props) {
    super(props)
    this.handleContinue = this.handleContinue.bind(this)
  }

  handleContinue () {
    console.log(`Welcome state: ${JSON.stringify(this.props.profile)}`)
    if (this.props.profile.isAuthenticated) {
      this.props.history.push(DASHBOARD_URL)
    } else {
      window.location.replace('/oidc/authenticate')
    }
  }

  render () {
    return (
      <div className="welcome-page">
        <img
          className="mozilla-logo"
          src={staticAsset('media/mozilla-logo.svg')}
          alt=""
        />
        <div className="page-content">
          <div className="brand-container">
            <img
              className="welcome-image"
              src={staticAsset('media/welcome-image-1x.png')}
              srcSet={`
                ${staticAsset('media/welcome-image-3x.png')} 3x,
                ${staticAsset('media/welcome-image-2x.png')} 2x,
                ${staticAsset('media/welcome-image-1x.png')}
              `}
              alt=""
            />
          </div>
          <section className="info-container">
            <DecomBanner />
          </section>
          <Button
            label="Let's Start"
            className="continue-button standard-button-wide"
            onClick={this.handleContinue}
          />
        </div>
        <footer>
          <span className="footer-text">
            Already a contributor?{' '}
            <span onClick={this.handleContinue} className="footer-link">
              Login
            </span>
          </span>
        </footer>
      </div>
    )
  }
}

WelcomePage.propTypes = {
  continue: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired
}
