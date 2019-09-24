import React, { Fragment } from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import { FirstChild } from '@components/first-child'

import Toolbar from '@components/toolbar'
import ModerateCard from '@components/moderate-card'
import ReviewCard from '@components/review-card'
import RespondCard from '@components/respond-card'
import Button from '@components/buttons'
import ToggleButton from '@components/buttons/toggle'
import AlertPrompt from '@components/alert-prompt'
import NoticePrompt from '@components/notice-prompt'
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
    isEditingResp: false,
    hasSubmitted: false,
    isCannedMenuOpen: false,
    isHelpDocsMenuOpen: false,
    currResponse: {},
    editedResponse: '',
    criteria: {
      positive: null,
      relevant: null,
      personal: null
    },
    messages: [],
    feedbackMessage: '',
    noticeData: {
      message: '',
      karma: 0,
      type: '',
      isOpen: false,
      timeout: 3000
    }
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
        this.pushNotice(err, 'error')
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
      responses,
      profile: {
        isMod,
        isSuperMod
      },
      cannedResponses,
      helpDocs
    } = this.props

    const {
      isEditingResp,
      editedResponse,
      isResDetailsOpen,
      isModerating,
      messages,
      criteria,
      isCannedMenuOpen,
      isHelpDocsMenuOpen,
      currResponse,
      noticeData
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
        <CSSTransitionGroup
          transitionName='slide-out-top'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          component={FirstChild}>
          {noticeData.isOpen ? (
            <NoticePrompt data={noticeData} closeNotice={this.resetNotice.bind(this)} />
          ) : null}
        </CSSTransitionGroup>
        <header className='moderate-page-header'>
          <Toolbar
            className='moderate-page-toolbar'
            title={this.pageTitle()}
            invertBackIcon={true}
            onBack={this.toolbarBackBtn()}
            rightComponent={isEditingResp ? null : rightHelpMenu} />
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

          {responses.count && !isResDetailsOpen ? (
            <Fragment>
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
          ) : null}

          {isResDetailsOpen && !isEditingResp ? (
            <Fragment>
              <ModerateCard
                className='moderate-page-response'
                reviewAuthor={currResponse.review.author}
                reviewDate={currResponse.review.dateSubmitted}
                reviewText={currResponse.review.text}
                reviewRating={currResponse.review.rating}
                responseText={editedResponse || currResponse.text}
                responseDate={currResponse.submittedAt}
                productName={currResponse.review.product.name}
                productImage={currResponse.review.product.image}
                productVersion={currResponse.review.product.version || {}}
                androidVersion={currResponse.review.androidVersion}
                modCount={currResponse.moderationCount}
              />

              {editedResponse ? (
                <div className='moderate-page-notice-editresp'>
                  <div className='moderate-page-notice-editresp-content'>
                    <div className='moderate-page-notice-editresp-content-icon'>
                      <Icon iconName='info' />
                    </div>
                    <div className='moderate-page-notice-editresp-content-text'>
                      <p>You are viewing an <strong>edited version</strong> of this response. Changes will not be applied until you have completed moderating this response.</p>
                    </div>
                  </div>
                  <div className='moderate-page-notice-editresp-control'>
                    <button onClick={this.cancelEditingResp}>
                      <Icon iconName='undo' />
                      <span>Revert edits</span>
                    </button>
                  </div>
                </div>
              ) : null}

              {isModerating ? (
                <div className='moderate-page-form'>
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

                  <div className={'moderate-page-actions moderate-page-actions--form' + (isMod ? ' moderate-page-actions--form-between' : '')}>
                    {isMod ? (
                      <Button
                        label='Edit response'
                        className='moderate-page-actions-approve'
                        onClick={this.startEditingResp}
                      />
                    ) : null}
                    <Button
                      label='Submit'
                      className='moderate-page-actions-moderate'
                      onClick={this.submitModeration}
                      disabled={!this.allCriteriaAnswered(criteria)}
                    />
                  </div>
                </div>) : null
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
        </div>

        {isEditingResp ? (
          <Fragment>
            <div className='moderate-page-container'>
              <RespondCard
                className='moderate-page-review'
                author={currResponse.review.author}
                date={currResponse.review.lastModified}
                review={currResponse.review.text}
                rating={currResponse.review.rating}
                productName={currResponse.review.product.name}
                productVersion={currResponse.review.product.version || {}}
                productImage={currResponse.review.product.image}
                androidVersion={currResponse.review.androidVersion}
              />
            </div>

            <div className='moderate-page-edit-response'>
              <div className='moderate-page-edit-response-content'>
                <div className='response-page-response-actions'>
                  <Button
                    label='Canned Responses'
                    className='moderate-page-edit-response-guide-button'
                    icon={staticAsset('media/icons/sidebar.svg')}
                    onClick={this.toggCannedResponses} />
                </div>
                <form className='moderate-page-edit-response-form'>
                  <Textarea
                    maxLength={350}
                    value={editedResponse}
                    placeholder='Add Your Response'
                    onChange={this.updateEditedResponse}
                    rows={6}
                  />
                  <Button
                    label='Done'
                    className='moderate-page-edit-response-form-submit'
                    onClick={this.submitEditingResp} />
                  <Button
                    type='link'
                    label='Cancel'
                    className='moderate-page-edit-response-form-cancel'
                    onClick={() => { this.cancelEditingResp(true) }} />
                </form>
              </div>
            </div>
          </Fragment>
        ) : null}

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

  updateEditedResponse = e => {
    this.setState({ editedResponse: e.target.value })
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
        this.pushNotice(err, 'error')
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

  resetNotice = () => {
    this.setState({
      noticeData: {
        message: '',
        karma: 0,
        type: '',
        isOpen: false
      }
    })
  }

  pageTitle = () => {
    return this.state.isEditingResp ? 'Edit contributor\'s response' : 'Moderate'
  }

  toolbarBackBtn = () => {
    const {
      isEditingResp,
      isResDetailsOpen
    } = this.state

    return isEditingResp ? this.cancelEditingResp : isResDetailsOpen ? this.closeResDetails : this.props.back
  }

  startEditingResp = () => {
    this.setState({
      isEditingResp: true,
      editedResponse: ''
    })
  }

  cancelEditingResp = (doPushNotice) => {
    this.setState({
      isEditingResp: false,
      editedResponse: ''
    })

    if (doPushNotice) this.pushNotice('Edits reverted')
  }

  submitEditingResp = () => {
    // Only close the response pane and keep what was entered into "editedResponse"
    this.setState({
      isEditingResp: false
    })
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

    this.cancelEditingResp()

    this.setState({
      currResponse: {},
      isResDetailsOpen: false
    })
  }

  submitModeration = () => {
    const {
      editedResponse,
      feedbackMessage
    } = this.state

    const {
      responses
    } = this.props

    // TODO @ REDUX STAGE: SUBMIT LOGIC...
    this.props.onModerationUpdate({
      criteria: this.state.criteria,
      feedbackMessage: feedbackMessage
    })
    this.props.submitModeration((message, err) => {
      if (err) {
        this.pushNotice(message, 'error')
      } else {
        this.pushNotice(feedbackMessage ? 'Feedback Sent!' : 'Response moderated', 'success', 10)
      }
      this.closeResDetails()
    }, this.state.currResponse.id, responses.currPage, editedResponse)
  }

  submitApproval = () => {
    const {
      responses
    } = this.props

    this.props.submitApproval((message, err) => {
      if (err) {
        this.pushNotice('Unable to approve', 'error')
      } else {
        this.pushNotice('Response approved', 'success', 10)
      }
      this.closeResDetails()
    }, this.state.currResponse.id, responses.currPage)
  }

  pushNotice = (message, type = 'success', karma = 0) => {
    this.setState({
      noticeData: {
        message,
        karma,
        type,
        isOpen: true
      }
    })
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
