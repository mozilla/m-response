import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'
import { FirstChild } from '@components/first-child'

import Toolbar from '@components/toolbar'
import Icon from '@components/icon'
import './help-docs.scss'

export default class HelpDocs extends React.Component {
  state = {
    isListOpen: false,
    selectedDoc: {
      id: 0,
      title: '',
      body: ''
    }
  }

  componentWillMount () {
    if (this.props.openTo) {
      const result = this.props.helpData.find(doc => {
        return doc.title.toLowerCase() === this.props.openTo
      })

      if (result) this.setState({ isListOpen: true, selectedDoc: result })
    }
  }

  render () {
    const { className = '', helpData } = this.props

    const {
      isListOpen,
      selectedDoc
    } = this.state

    return (
      <div className={`help-docs ${className}`}>
        <div className='help-docs-inner'>

          <CSSTransitionGroup
            transitionName='slide-out-right'
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
            component={FirstChild}>
            {isListOpen ? <div className="help-docs-document">
              <Toolbar
                className='help-docs-toolbar'
                title={selectedDoc.title}
                onBack={this.toggListOptions} />
              <div className="help-docs-document-inner" dangerouslySetInnerHTML={{ __html: selectedDoc.body }}></div>
            </div> : null }
          </CSSTransitionGroup>
          <div className='help-docs-content'>
            <div className='help-docs-content-list'>
              <p>Use the categories below to learn more about Respond Tool features and usage tips.</p>
              <ul className=''>
                {helpData.map(doc => (
                  <li key={doc.id}>
                    <button onClick={() => this.toggListOptions(doc)}>
                      <span>{doc.title}</span>
                      <Icon iconName='helpFolder' />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className='help-docs-content-bottomlink'>
              <a href=''>Legacy help document<Icon iconName='openInNew' /></a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  toggListOptions = (doc) => {
    this.setState({
      isListOpen: !this.state.isListOpen,
      selectedDoc: doc
    })
  }
}

HelpDocs.propTypes = {
  className: PropTypes.string,
  helpData: PropTypes.array.isRequired
}
