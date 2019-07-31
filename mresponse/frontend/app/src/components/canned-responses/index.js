import React from 'react'
import PropTypes from 'prop-types'

// import { staticAsset } from '@utils/urls'
import Toolbar from '@components/toolbar'
// import Button from '@components/buttons'
import './canned-responses.scss'

export default class cannedResponses extends React.Component {
  componentDidMount () {
    console.log('wow look a component')
  }
  render () {
    const { className = '', cannedData } = this.props
    return (
      <div className={`canned-responses ${className}`}>
        <div className='canned-responses-inner'>
          <Toolbar
            className='canned-responses-toolbar'
            title='This is a title' />
          <ul className='canned-responses-canned-content' data-remove={cannedData}>
            <li>
              <button>
                <span>Content box 1</span>
              </button>
            </li>
            <li>
              <button>
                <span>Content box 2</span>
              </button>
            </li>
            <li>
              <button>
                <span>Content box 3</span>
              </button>
            </li>
            <li>
              <button>
                <span>Content box 4</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

cannedResponses.propTypes = {
  className: PropTypes.string,
  cannedData: PropTypes.object
}
