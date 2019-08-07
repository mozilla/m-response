import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { fetchNewReviews, fetchNextReview, updateCurrentResponse, submitResponse, skipReview } from '@redux/actions'
import { getCurrentReview, getNextReview, getProfile, getCannedResponses } from '@redux/selectors'

import { DASHBOARD_URL, GUIDE_BOOK_URL } from '@utils/urls'

import RespondPage from './respond'

const mapStateToProps = (state, props) => ({
  review: getCurrentReview(state),
  nextReview: getNextReview(state),
  response: state.respond.currentReviewResponse,
  guideBookUrl: GUIDE_BOOK_URL,
  profile: getProfile(state),
  cannedResponses: getCannedResponses(state)
})
const mapDispatchToProps = (dispatch, props) => {
  return {
    back: () => dispatch(push(DASHBOARD_URL)),
    fetchNewReviews: cb => dispatch(fetchNewReviews(cb)),
    fetchNextReview: () => dispatch(fetchNextReview()),
    onResponseUpdate: response => dispatch(updateCurrentResponse(response)),
    skipReview: () => dispatch(skipReview()),
    submitResponse: cb => dispatch(submitResponse(cb))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RespondPage)
