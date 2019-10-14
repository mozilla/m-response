import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { PROFILE_URL, RESPOND_URL, MODERATE_URL } from '@utils/urls'
import { updateAppConfig, updateHomeConfig, fetchExtraUserMeta, fetchProfile, fetchLeaderboard, fetchCannedResponses, fetchHelpDocs } from '@redux/actions'
import { getModerateQueue, getRespondQueue, getFeedbackUrl, getAboutUrl, getProfile, getLeaderboard, getCannedResponses, getHelpDocs } from '@redux/selectors'
import HomePage from './home'
// import { getHelpDocs } from '../../redux/selectors';

const mapStateToProps = (state, props) => ({
  respondQueue: getRespondQueue(state),
  moderateQueue: getModerateQueue(state),
  feedbackLink: getFeedbackUrl(state),
  aboutLink: getAboutUrl(state),
  profile: getProfile(state),
  leaderboard: getLeaderboard(state),
  cannedResponses: getCannedResponses(state),
  helpDocs: getHelpDocs(state)
})

const mapDispatchToProps = (dispatch, props) => ({
  goToRespondMode: () => dispatch(push(RESPOND_URL)),
  goToModerateMode: () => dispatch(push(MODERATE_URL)),
  goToProfile: () => dispatch(push(PROFILE_URL)),
  updateKarma: () => dispatch(fetchExtraUserMeta()),
  updateProfile: () => dispatch(fetchProfile()),
  updateAppConfig: () => dispatch(updateAppConfig()),
  updateHomeConfig: () => dispatch(updateHomeConfig()),
  updateLeaderboard: () => dispatch(fetchLeaderboard()),
  updateCannedResponses: () => dispatch(fetchCannedResponses()),
  updateHelpDocs: () => dispatch(fetchHelpDocs())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage)
