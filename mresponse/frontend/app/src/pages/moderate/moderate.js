import React, { Fragment } from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import { FirstChild } from '@components/first-child'

import Toolbar from '@components/toolbar'
import ModerateCard from '@components/moderate-card'
import ReviewCard from '@components/review-card'
import Button from '@components/buttons'
import ToggleButton from '@components/buttons/toggle'
import AlertPrompt from '@components/alert-prompt'
import Textarea from '@components/textarea'
import SideBar from '@components/side-bar'
import CannedResponses from '@components/canned-responses'
import HelpDocs from '@components/help-docs'
import Icon from '@components/icon'
import { staticAsset } from '@utils/urls'
import './moderate.scss'

export default class ModeratePage extends React.Component {
  state = {
    isResDetailsOpen: false,
    isModerating: false,
    isDoneEditing: false,
    hasSubmitted: false,
    isCannedMenuOpen: false,
    isHelpDocsMenuOpen: false,
    currResponse: {},
    criteria: {
      positive: null,
      relevant: null,
      personal: null
    },
    messages: [],
    feedbackMessage: ''
  }

  componentWillMount () {
    const {
      fetchResponses,
      profile: {
        isMod
      }
    } = this.props

    fetchResponses((successMessage, err) => {
      if (err) {
        this.pushMessage(err, true)
      }
    })

    // If the user is not trusted,
    // set isModerating to show the form immediately
    this.setState({
      isModerating: !isMod
    })
  }

  render () {
    const {
      back,
      responses,
      profile: {
        isMod
      },
      cannedResponses,
      helpDocs
    } = this.props

    const {
      isResDetailsOpen,
      isModerating,
      messages,
      criteria,
      isCannedMenuOpen,
      isHelpDocsMenuOpen,
      currResponse
    } = this.state

    const sideBarCannedContent = (
      <CannedResponses cannedData={cannedResponses}/>
    )

    const rightHelpMenu = (
      <button className="toolbar-right-help-button" onClick={() => (this.toggHelpDocsMenu())}>
        <Icon iconName='help'/>
      </button>
    )

    const sideBarHelpContent = (
      <HelpDocs helpData={helpDocs} openTo='moderating'/>
    )

    return (
      <div className='moderate-page'>
        <header className='moderate-page-header'>
          <Toolbar
            className='moderate-page-toolbar'
            title='Moderate'
            invertBackIcon={true}
            onBack={back}
            rightComponent={rightHelpMenu} />
        </header>

        <div className='moderate-page-container'>
          {messages.map((message, index) => (
            <div key={`moderate-alert-${index}`}>
              <AlertPrompt
                className='respond-page-alert-prompt'
                title={message.title}
                message={message.text}
                isError={message.isError} />
            </div>
          ))}
        </div>

        <div className='moderate-page-container'>
          {responses.count && !isResDetailsOpen ? (
            <Fragment>
              {/* List of responses to moderate */}
              {responses.results.map(response => (
                <ReviewCard
                  key={response.id}
                  className='moderate-page-response'
                  responseText={response.text}
                  modCount={response.moderationCount}
                  onClick={() => this.openResDetails(response)}
                />
              ))}

              <div className='moderate-page-pagination'>
                <button className='moderate-page-pagination-btn' disabled={responses.currPage <= 1} onClick={e => this.handlePageUpdate(responses.currPage - 1)}>
                  <Icon iconName='arrowLeft' />
                  <span>Previous</span>
                </button>
                <div className='moderate-page-pagination-select'>
                  <select value={responses.currPage} onChange={e => this.handlePageUpdate(e.target.value)}>
                    {responses.pages[0] > 1 ? <option value={1}>First</option> : null}
                    {responses.pages.map(page => (
                      <option
                        disabled={page === responses.currPage}
                        key={page}
                        value={page}>
                        {page}
                      </option>
                    ))}
                    {responses.pages[responses.pages.length - 1] < responses.pagesCount ? <option value={responses.pagesCount}>Last</option> : null}
                  </select>
                  <Icon iconName='chevDown' className='moderate-page-pagination-select-icon' />
                </div>
                <button className='moderate-page-pagination-btn' disabled={responses.currPage === responses.pagesCount} onClick={e => this.handlePageUpdate(responses.currPage + 1)}>
                  <span>Next</span>
                  <Icon iconName='arrowRight' />
                </button>
              </div>
            </Fragment>
          ) : null }

          {responses.count ? (
            <Fragment>
              {/* Moderation feedback */}
              {isResDetailsOpen ? (
                <Fragment>
                  <ModerateCard
                    className='moderate-page-response'
                    reviewAuthor={currResponse.review.author}
                    reviewDate={currResponse.review.dateSubmitted}
                    reviewText={currResponse.review.text}
                    reviewRating={currResponse.review.rating}
                    responseText={currResponse.text}
                    responseDate={currResponse.submittedAt}
                    productName={currResponse.review.product.name}
                    productImage={currResponse.review.product.image}
                    productVersion={currResponse.review.product.version || {}}
                    androidVersion={currResponse.review.androidVersion}
                    modCount={currResponse.moderationCount}
                  />

                  {isModerating
                    ? <div className='moderate-page-form'>
                      <div className='moderate-page-form-main'>
                        <div className='moderate-page-form-row'>
                          <span className='moderate-page-form-row-title'>
                            Does this response {' '}
                            <span className="moderate-page-form-row-strong">feel friendly?</span>
                          </span>
                          <div className='moderate-page-form-row-buttons'>
                            <ToggleButton
                              label="Yes!"
                              toggled={criteria.positive === true}
                              handleClick={() => this.toggleCriteria('positive', true)}
                              icon={staticAsset('media/icons/smile.svg')} />
                            <ToggleButton
                              label="Not Really"
                              toggled={criteria.positive === false}
                              handleClick={() => this.toggleCriteria('positive', false)}
                              icon={staticAsset('media/icons/sad.svg')} />
                          </div>
                        </div>

                        <div className='moderate-page-form-row'>
                          <span className='moderate-page-form-row-title'>
                            Is this response {' '}
                            <span className="moderate-page-form-row-strong">technically accurate?</span>
                          </span>
                          <div className='moderate-page-form-row-buttons'>
                            <ToggleButton
                              label="Yes!"
                              toggled={criteria.relevant === true}
                              handleClick={() => this.toggleCriteria('relevant', true)}
                              icon={staticAsset('media/icons/smile.svg')} />
                            <ToggleButton
                              label="Not Really"
                              toggled={criteria.relevant === false}
                              handleClick={() => this.toggleCriteria('relevant', false)}
                              icon={staticAsset('media/icons/sad.svg')} />
                          </div>
                        </div>

                        <div className='moderate-page-form-row'>
                          <span className='moderate-page-form-row-title'>
                            <span className="moderate-page-form-row-strong">Would you reuse this response</span>{' '}
                            for a similar question?
                          </span>
                          <div className='moderate-page-form-row-buttons'>
                            <ToggleButton
                              label="Yes!"
                              toggled={criteria.personal === true}
                              handleClick={() => this.toggleCriteria('personal', true)}
                              icon={staticAsset('media/icons/smile.svg')} />
                            <ToggleButton
                              label="Not Really"
                              toggled={criteria.personal === false}
                              handleClick={() => this.toggleCriteria('personal', false)}
                              icon={staticAsset('media/icons/sad.svg')} />
                          </div>
                        </div>

                        {isMod &&
                          <div className='moderate-page-form-row'>
                            <span className='moderate-page-form-row-title'>
                              Feedback message {' '} <span className="moderate-page-form-row-em">optional</span>
                            </span>
                            <div>
                              <Textarea
                                value={this.state.feedbackMessage}
                                onChange={event => this.setState({ feedbackMessage: event.target.value })}
                              />
                            </div>
                          </div>
                        }
                      </div>

                      <div className='moderate-page-actions moderate-page-actions--form'>
                        <Button
                          label='Submit'
                          className='moderate-page-actions-moderate'
                          onClick={this.submitModeration}
                          disabled={!this.allCriteriaAnswered(criteria)}
                        />
                      </div>
                    </div> : null
                  }

                  {isMod && !isModerating
                    ? <div className='moderate-page-actions moderate-page-actions--trusted'>
                      <Button
                        label='Approve'
                        className='moderate-page-actions-approve'
                        onClick={this.submitApproval}
                        icon={staticAsset('media/icons/check-white.svg')} />
                      <Button
                        label='Moderate'
                        className='moderate-page-actions-moderate'
                        onClick={this.setIsModerating} />
                    </div> : null
                  }

                  <div className='moderate-page-controls'>
                    <Button
                      type='link'
                      label='Back'
                      onClick={() => this.closeResDetails()} />
                  </div>
                </ Fragment>
              ) : null}
            </Fragment>
          ) : null}
        </div>

        <CSSTransitionGroup
          transitionName='sideBarAnim'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          component={FirstChild}>
          {isCannedMenuOpen ? <SideBar
            className=''
            title='Canned Responses'
            handleClose={this.toggCannedResponses.bind(this)}
            content={sideBarCannedContent} /> : null}
        </CSSTransitionGroup>

        <CSSTransitionGroup
          transitionName='sideBarAnim'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          component={FirstChild}>
          {isHelpDocsMenuOpen ? <SideBar
            className=''
            title='Help and Documentation'
            handleClose={this.toggHelpDocsMenu.bind(this)}
            content={sideBarHelpContent} /> : null}
        </CSSTransitionGroup>
      </div>
    )
  }

  toggCannedResponses = (e) => {
    const toggMenu = () => (this.setState({ isCannedMenuOpen: !this.state.isCannedMenuOpen }))
    if (e) {
      if (e.currentTarget === e.target) toggMenu()
    } else toggMenu()
  }

  toggHelpDocsMenu = (e) => {
    const toggMenu = () => (this.setState({ isHelpDocsMenuOpen: !this.state.isHelpDocsMenuOpen }))
    if (e) {
      if (e.currentTarget === e.target) toggMenu()
    } else toggMenu()
  }

  handlePageUpdate = (pageNum) => {
    this.props.fetchResponses((successMessage, err) => {
      if (err) {
        this.pushMessage(err, true)
      }
    }, pageNum)
  }

  toggleCriteria = (option, value) => {
    this.setState(state => ({
      ...state,
      criteria: {
        ...state.criteria,
        [option]: value
      }
    }))
  }

  allCriteriaAnswered = (criteria) => {
    return Object.entries(criteria).every(([, value]) => value !== null)
  }

  setIsModerating = () => this.setState({ isModerating: true })

  startModerating = (response) => {
    this.setState({
      currResponse: response,
      isModerating: true
    })
  }

  cancelModerating = () => {
    this.setState({
      currResponse: {},
      isModerating: false
    })
  }

  openResDetails = (response) => {
    this.setState({
      currResponse: response,
      isResDetailsOpen: true
    })
  }

  closeResDetails = () => {
    // Put user at top of screen
    window.scrollTo(0, 0)

    this.resetAll()

    this.setState({
      currResponse: {},
      isResDetailsOpen: false
    })
  }

  submitModeration = () => {
    const {
      responses
    } = this.props

    // TODO @ REDUX STAGE: SUBMIT LOGIC...
    this.props.onModerationUpdate({
      criteria: this.state.criteria,
      feedbackMessage: this.state.feedbackMessage
    })
    this.props.submitModeration((message, err) => {
      if (err) {
        this.pushMessage(message, true)
      } else {
        this.pushMessage(message)
      }
      this.closeResDetails()
    }, this.state.currResponse.id, responses.currPage)
  }

  submitApproval = () => {
    const {
      responses
    } = this.props

    this.props.submitApproval((message, err) => {
      if (err) {
        this.pushMessage(message, true)
      } else {
        this.pushMessage(message)
      }
      this.closeResDetails()
    }, this.state.currResponse.id, responses.currPage)
  }

  pushMessage = (text, isError = false) => {
    let message = {}
    if (isError) {
      message = {
        title: 'Error!',
        text,
        isError: true
      }
    } else {
      message = {
        title: 'Success',
        text,
        isError: false
      }
    }
    this.setState(state => {
      return { messages: [message, ...state.messages] }
    })
  }

  resetAll = () => {
    const {
      profile: {
        isMod
      }
    } = this.props

    // Clear form data
    this.resetData()

    // Reset the form to it's hidden for trusted users
    if (isMod) {
      this.resetForm()
    }
  }

  resetData = () => this.setState({
    criteria: {
      positive: null,
      relevant: null,
      personal: null
    },
    feedbackMessage: ''
  })

  resetForm = () => this.setState({
    isModerating: false
  })
}
