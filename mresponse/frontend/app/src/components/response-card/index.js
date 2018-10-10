import React from 'react'
import './response-card.scss'

export default class ResponseCard extends React.Component {
    state = { expanded: false }

    render () {
      const { className, response, date, productImage, productName } = this.props
      const comment = (this.state.expanded && response)
        ? response
        : response.substring(0, 250) + '...'
      return (
        <div className={`response-card ${className}`}>
          <div className='response-card-header'>
            <img
              className='response-card-header-image'
              src={productImage} alt='' />
            <span className='response-card-header-title'>{productName}</span>
          </div>
          <div className={`response-card-comment ${this.state.expanded ? 'response-card-comment--expanded' : ''}`}>
            <p className='response-card-comment-text'>{comment}</p>
          </div>
          <div className='response-card-footer'>
            <span className='response-card-footer-date'>{date}</span>
            <span
              className='response-card-footer-expand'
              onClick={this.toggleExpansion}>
              {this.state.expanded ? 'Read Less' : 'Read More'}
            </span>
          </div>
        </div>
      )
    }

    toggleExpansion = () => this.setState({ expanded: !this.state.expanded })
}
