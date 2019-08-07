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
              <div className="help-docs-document-inner" dangerouslySetInnerHTML={{ __html: selectedDoc.body }}>
                {/* <p>Lorem ipsum dolor sit amet consectetur, adipiscing elit et netus, ut neque penatibus sollicitudin.</p>
                <ul>
                  <li><strong>Qquisque</strong> torquent inceptos</li>
                  <li>Lacus dui laoreet vulputate</li>
                  <li>Sapien, est justo ut lacus magnis</li>
                  <li>Scelerisque, imperdiet phasellus morbi cum <strong>maecenas vulputate</strong> potenti venenatis. Primis lectus pharetra tellus sociosqu diam curabitur, vehicula mattis varius senectus sodales litora euismod</li>
                </ul>
                <p>Euismod placerat venenatis torquent <strong>mollis lobortis</strong> class fusce iaculis sed scelerisque, bibendum consequat tellus laoreet blandit luctus penatibus sodales semper, neque aenean quam <a href='https://developer.mozilla.org/en-US/'>aliquam netus tristique</a> natoque ligula. Dictum aenean augue himenaeos placerat libero vel rutrum praesent sagittis leo, lobortis faucibus odio nam mauris feugiat et dui enim, class pharetra suspendisse quam mollis aptent <strong>aenean pharetra</strong>. Viverra lobortis nam suscipit erat integer commodo praesent ut bibendum accumsan, duis libero suspendisse facilisis litora nec purus odio massa et nisi, dignissim leo ac enim lacus dui laoreet vulputate maecenas. Eleifend vel etiam gravida tincidunt mauris ultrices pharetra maecenas consequat netus primis, vestibulum potenti taciti augue malesuada et nisi euismod blandit accumsan.</p>
                <h1>h1 - Faucibus odio</h1>
                <h2>h2 - Dictumst bibendum</h2>
                <h3>h3 - Arcu augue dapibus</h3>
                <h4>h4 - Imperdiet phasellus</h4>
                <h5>h5 - Euismod placerat venenatis</h5>
                <h6>h6 - Platea facilisis</h6>
                <p><strong>Posuere bibendum</strong> nisl commodo convallis odio pulvinar, in elementum at vitae habitasse, ad eget felis enim suspendisse. Luctus maecenas natoque tempus dictum phasellus consequat cubilia commodo class, egestas netus mattis aliquet libero vestibulum purus justo nisi, dictumst etiam pharetra orci elementum suspendisse ac quam. Imperdiet lectus eros parturient nullam dis porttitor at interdum sociis, feugiat cubilia phasellus luctus aliquam vitae montes odio, ante suspendisse congue facilisis semper enim nunc pulvinar.</p>
                <p>Cursus ad euismod accumsan blandit mauris conubia et semper sapien, est justo ut lacus magnis vivamus quis. Conubia magna lacinia ligula eleifend iaculis massa laoreet ad, quisque dictumst bibendum arcu augue dapibus dictum nascetur, ultrices urna metus vitae platea nullam sem. Sociis nibh commodo interdum arcu neque integer maecenas quisque torquent inceptos lectus, vel accumsan turpis primis senectus vehicula lacinia sed a laoreet. Lacinia ad dictumst semper duis cum torquent vulputate, in taciti velit tincidunt vestibulum.</p>
                <p>Urna venenatis imperdiet sem pulvinar hac ornare litora platea, turpis nascetur fames phasellus erat eros sociis, potenti montes massa tristique malesuada <strong>maecenas vulputate</strong>. Fusce litora egestas pretium ornare fringilla pellentesque accumsan felis, sollicitudin et dictum quam massa gravida vestibulum scelerisque, imperdiet phasellus morbi cum molestie potenti venenatis. Primis lectus pharetra tellus sociosqu diam curabitur, vehicula mattis varius senectus sodales litora euismod, consequat turpis habitant lobortis ultrices.</p>
                <p>Nunc primis mollis aenean dapibus class ligula ut, torquent nisi orci tincidunt vivamus ridiculus ultrices eros, rutrum hac suspendisse metus nascetur leo. Parturient feugiat vel nec nam sociis torquent penatibus iaculis ultrices tristique condimentum, mauris ultricies magna euismod at eros fringilla pharetra eu diam, duis habitant facilisi interdum netus malesuada nostra hendrerit magnis eleifend. Netus molestie congue conubia feugiat eu sem tempus platea facilisis, pulvinar habitant ac nisl mi tempor augue pharetra, vel lectus aenean commodo hendrerit at nisi.</p>
                <p>Ac montes maecenas euismod vehicula libero lectus platea vulputate, congue ullamcorper morbi proin sociosqu pretium nec, commodo rutrum tristique mollis facilisi volutpat interdum. Velit blandit sollicitudin faucibus volutpat gravida sociis duis, laoreet mus varius sociosqu vestibulum odio, primis leo morbi natoque praesent sapien. Justo ligula consequat cras hac nunc quis tempor gravida nullam, metus orci nisl purus diam penatibus non luctus taciti, sodales rhoncus odio dui habitasse nascetur egestas a. Nam porta vivamus penatibus feugiat dis semper integer platea aptent rhoncus, hendrerit condimentum congue ad per vestibulum blandit viverra ligula, conubia faucibus pharetra inceptos hac facilisis ac mauris at.</p> */}
              </div>
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
