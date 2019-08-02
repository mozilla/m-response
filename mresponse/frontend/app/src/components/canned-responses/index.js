import React from 'react'
import PropTypes from 'prop-types'
import Clipboard from 'clipboard'
import { CSSTransitionGroup } from 'react-transition-group'
import { FirstChild } from '@components/first-child'

import Toolbar from '@components/toolbar'
import { noty } from '@components/noty'
import './canned-responses.scss'

export default class cannedResponses extends React.Component {
  state = {
    isListOpen: false
  }

  clipboard = new Clipboard('.copy-me', {
    text: trigger => {
      return trigger.innerHTML
    }
  })

  componentDidMount () {
    this.clipboard.on('success', e => {
      noty({
        text: 'Response copied',
        icon: 'copy'
      })
      e.clearSelection()
    })

    this.clipboard.on('error', e => {
      console.error('Clipboard Action:', e.action)
      console.error('Clipboard Trigger:', e.trigger)
    })
  }

  componentWillUnmount () {
    // Keep the clutter down
    this.clipboard.destroy()
  }

  render () {
    const { className = '', cannedData } = this.props

    const {
      isListOpen
    } = this.state

    return (
      <div className={`canned-responses ${className}`}>
        <div className='canned-responses-inner'>

          <CSSTransitionGroup
            transitionName='slide-out-right'
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
            component={FirstChild}>
            {isListOpen ? <div className="canned-responses-list-options">
              <Toolbar
                className='canned-responses-toolbar'
                title='This is a title'
                onBack={this.toggListOptions} />
              <div className="canned-responses-list-options-inner">
                <p>Click/tap on a canned response to copy it to the clipboard</p>
                <ul>
                  <li><button className="copy-me">Lorem ipsum dolor sit amet consectetur adipiscing elit dui potenti, vehicula non orci a integer ultrices mollis praesent lobortis nullam, ante vulputate congue pellentesque dis arcu id molestie. Litora suspendisse facilisi at gravida duis vitae sagittis ornare mi sociis, laoreet vivamus blandit egestas proin commo ultricies, aliquet semper dapibus interdum nunc erat eget condimentum ullamcorper. Diam bibendum nisl dictum tempor mus pharetra, natoque ridiculus tempus class.</button></li>
                  <li><button className="copy-me">Sit amet consectetur adipiscing elit dui potenti, vehicula non orci a integer ultrices mollis praesent lobortis nullam, ante vulputate congue pellentesque dis arcu id molestie. Litora suspendisse facilisi at gravida duis vitae sagittis ornare mi sociis, laoreet vivamus blandit egestas proin commodo est rhoncus accumsan ultricies, aliquet semper dapibus interdum nunc erat eget condimentum ullamcorper. Diam bibendum nisl dictum tempor mus pharetra, natoque ridiculus tempus class.</button></li>
                  <li><button className="copy-me">Ipsum dolor sit amet consectetur adipiscing elit dui potenti, vehicula non orci a integer ultrices mollis praesent lobortis nullam, ante vulputate, aliquet semper dapibus interdum nunc erat eget condimentum ullamcorper. Diam bibendum nisl dictum tempor mus pharetra, natoque ridiculus tempus class.</button></li>
                </ul>
              </div>
            </div> : null }
          </CSSTransitionGroup>
          <ul className='canned-responses-canned-content' data-remove={cannedData}>
            <li>
              <button onClick={this.toggListOptions}>
                <span>Content box 1</span>
              </button>
            </li>
            <li>
              <button onClick={this.toggListOptions}>
                <span>Content box 2</span>
              </button>
            </li>
            <li>
              <button onClick={this.toggListOptions}>
                <span>Content box 3</span>
              </button>
            </li>
            <li>
              <button onClick={this.toggListOptions}>
                <span>Content box 4</span>
              </button>
            </li>
            <li>
              <button onClick={this.toggListOptions}>
                <span>Content box 5</span>
              </button>
            </li>
            <li>
              <button onClick={this.toggListOptions}>
                <span>Content box 6</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  toggListOptions = () => {
    this.setState({ isListOpen: !this.state.isListOpen })
  }
}

cannedResponses.propTypes = {
  className: PropTypes.string,
  cannedData: PropTypes.object
}
