import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { fetchNewReviews, fetchNextReview, updateCurrentResponse, submitResponse, skipReview } from '@redux/actions'
import { getCurrentReview, getNextReview, getApiToken } from '@redux/selectors'

import { DASHBOARD_URL } from '@utils/urls'

import RespondPage from './respond'

const mapStateToProps = (state, props) => ({
  review: getCurrentReview(state),
  nextReview: getNextReview(state),
  response: state.respond.currentReviewResponse,
  guideBookUrl: '#',
  api: props.constructApi(getApiToken(state))
})
const mapDispatchToProps = (dispatch, props) => ({
  back: () => dispatch(push(DASHBOARD_URL)),
  fetchNewReviews: (api) => dispatch(fetchNewReviews(api)),
  fetchNextReview: (api) => dispatch(fetchNextReview(api)),
  onResponseUpdate: response => dispatch(updateCurrentResponse(response)),
  skipReview: (api) => dispatch(skipReview(api)),
  submitResponse: (api, cb) => dispatch(submitResponse(api, cb)),
  fetchReview: () => true
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RespondPage)
