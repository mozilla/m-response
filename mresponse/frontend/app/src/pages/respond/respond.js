import React from 'react'

import Toolbar from '@components/toolbar'
import './respond.scss'

export default class RespondPage extends React.Component {
  render () {
    return (
      <div className='respond-page'>
        <Toolbar
          title='Respond'
          leftComponent={
            <span
              className="respond-page-back-link"
              onClick={() => this.props.back()}
            >
                            Back
            </span>
          } />
      </div>
    )
  }
}
