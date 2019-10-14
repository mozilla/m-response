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
    isListOpen: false,
    selectedResponse: {
      name: '',
      list: []
    }
  }

  clipboard = new Clipboard('.copy-me', {
    text: e => (e.innerText)
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
      isListOpen,
      selectedResponse
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
                title={selectedResponse.name}
                onBack={this.toggListOptions} />
              <div className="canned-responses-list-options-inner">
                <p>Click/tap on a canned response to copy it to the clipboard</p>
                {!selectedResponse.list.length ? <p>No canned responses here yet</p> : <ul>
                  {selectedResponse.list.map(item => (
                    <li key={item.id}><button className="copy-me">{item.text}</button></li>
                  ))}
                </ul>}
              </div>
            </div> : null }
          </CSSTransitionGroup>
          <ul className='canned-responses-canned-content'>
            {cannedData.map(response => (
              <li key={response.slug}>
                <span className='canned-responses-canned-content-count' onClick={() => this.toggListOptions(response)}>{response.response_count}</span>
                <button onClick={() => this.toggListOptions(response)}>
                  <span>{response.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  toggListOptions = (response) => {
    this.setState({
      isListOpen: !this.state.isListOpen,
      selectedResponse: {
        name: response.name,
        list: response.responses
      }
    })
  }
}

cannedResponses.propTypes = {
  className: PropTypes.string,
  cannedData: PropTypes.array
}
