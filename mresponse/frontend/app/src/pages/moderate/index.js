import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { getResponses, getProfile, getCannedResponses, getHelpDocs } from '@redux/selectors'
import { fetchResponses, updateCurrentModeration, submitModeration, skipResponse, submitApproval } from '@redux/actions'
import { DASHBOARD_URL } from '@utils/urls'
import ModeratePage from './moderate'

const mapStateToProps = state => ({
  responses: getResponses(state),
  profile: getProfile(state),
  cannedResponses: getCannedResponses(state),
  helpDocs: getHelpDocs(state)
})

const mapDispatchToProps = (dispatch, props) => ({
  back: () => dispatch(push(DASHBOARD_URL)),
  fetchResponses: (cb, pageNum) => dispatch(fetchResponses(cb, pageNum)),
  onModerationUpdate: ({ criteria, feedbackMessage }) => dispatch(updateCurrentModeration({
    'positive_in_tone': criteria.positive,
    'addressing_the_issue': criteria.relevant,
    'personal': criteria.personal,
    'submitted_at': Date.now(),
    'feedback_message': feedbackMessage
  })),
  submitModeration: (cb, id) => dispatch(submitModeration(cb, id)),
  skipResponse: cb => dispatch(skipResponse(cb)),
  submitApproval: cb => dispatch(submitApproval(cb))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModeratePage)
