import React from 'react'
import PropTypes from 'prop-types'

import Button from '@components/buttons'
import './welcome.scss'

export default class WelcomePage extends React.Component {
  render () {
    return (
      <div className="welcome-page">
        <img
          className="mozilla-logo"
          src="/static/media/mozilla-logo.png"
          alt=""
        />
        <div className="page-content">
          <div className="brand-container">
            <img
              className="welcome-image"
              src="static/media/welcome-image.png"
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
          <Button
            label="Let's Start"
            className="continue-button"
            onClick={this.props.continue}
          />
        </div>
        <footer>
          <span className="footer-text">
            Already a contributor?{' '}
            <span onClick={this.props.login} className="footer-link">
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
