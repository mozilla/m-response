import React from 'react'
import { WELCOME_URL, DASHBOARD_URL, staticAsset } from '@utils/urls'
import './notfound.scss'

export default class NotFoundPage extends React.Component {
  render () {
    let backLink = this.props.isAuthenticated
      ? <a href={DASHBOARD_URL}>Back to dashboard</a>
      : <a href={WELCOME_URL}>Back to homepage</a>
    return (
      <div className="notfound-page">
        <img
          className="mozilla-logo"
          src={staticAsset('media/mozilla-logo.svg')}
          alt=""
        />
        <div className="page-content">
          <section className="info-container">
            <span className="info-tagline">Page not found</span>
            <span className="info-desc">
              Sorry, this page cannot be found.
            </span>
          </section>
        </div>
        <footer>
          <span className="footer-text">
            {backLink}
          </span>
        </footer>
      </div>
    )
  }
}
