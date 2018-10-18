import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { getCurrentResponse } from '@redux/selectors'
import { fetchNextResponse, updateCurrentModeration, submitModeration } from '@redux/actions'
import { DASHBOARD_URL } from '@utils/urls'
import ModeratePage from './moderate'

const mapStateToProps = state => ({
  response: getCurrentResponse(state)
})
const mapDispatchToProps = (dispatch, props) => ({
  back: () => dispatch(push(DASHBOARD_URL)),
  fetchNextResponse: cb => dispatch(fetchNextResponse(cb)),
  onModerationUpdate: ({ criteria, karma }) => dispatch(updateCurrentModeration({
    'positive_in_tone': criteria.positive,
    'addressing_the_issue': criteria.relevant,
    'personal': criteria.personal,
    'karma_points': karma,
    'submitted_at': Date.now()
  })),
  submitModeration: cb => dispatch(submitModeration(cb))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModeratePage)
