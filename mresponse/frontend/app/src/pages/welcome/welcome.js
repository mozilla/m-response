import React from 'react'
import PropTypes from 'prop-types'

import { staticAsset } from '@utils/urls'
import './welcome.scss'

export default class WelcomePage extends React.Component {
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
              src={staticAsset('media/welcome-image.png')}
              alt=""
            />
          </div>
          <section className="info-container">
            <span className="info-tagline">Saving The World From Your Couch</span>
            <span className="info-desc">
              This is a new and fun tool to make it fun and easy to respond as
              Mozilla on Google Play store reviews
            </span>
          </section>
          <a href="oidc/authenticate">Let's Start</a>
        </div>
        <footer>
          <span className="footer-text">
            Already a contributor?{' '} <a href="oidc/authenticate/">Login</a>
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
