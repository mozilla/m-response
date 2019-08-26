import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { getResponses, getProfile, getCannedResponses, getHelpDocs } from '@redux/selectors'
import { fetchNextResponse, updateCurrentModeration, submitModeration, skipResponse, submitApproval } from '@redux/actions'
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
  fetchNextResponse: cb => dispatch(fetchNextResponse(cb)),
  onModerationUpdate: ({ criteria, feedbackMessage }) => dispatch(updateCurrentModeration({
    'positive_in_tone': criteria.positive,
    'addressing_the_issue': criteria.relevant,
    'personal': criteria.personal,
    'submitted_at': Date.now(),
    'feedback_message': feedbackMessage
  })),
  submitModeration: cb => dispatch(submitModeration(cb)),
  skipResponse: cb => dispatch(skipResponse(cb)),
  submitApproval: cb => dispatch(submitApproval(cb))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModeratePage)
