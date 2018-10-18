import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { fetchNewReviews, fetchNextReview, updateCurrentResponse, submitResponse, skipReview } from '@redux/actions'
import { getCurrentReview, getNextReview } from '@redux/selectors'

import { DASHBOARD_URL } from '@utils/urls'

import RespondPage from './respond'

const mapStateToProps = (state, props) => ({
  review: getCurrentReview(state),
  nextReview: getNextReview(state),
  response: state.respond.currentReviewResponse,
  guideBookUrl: '#'
})
const mapDispatchToProps = (dispatch, props) => {
  return {
    back: () => dispatch(push(DASHBOARD_URL)),
    fetchNewReviews: () => dispatch(fetchNewReviews()),
    fetchNextReview: () => dispatch(fetchNextReview()),
    onResponseUpdate: response => dispatch(updateCurrentResponse(response)),
    skipReview: () => dispatch(skipReview()),
    submitResponse: cb => dispatch(submitResponse(cb)),
    fetchReview: () => true
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RespondPage)
