import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { PROFILE_URL, RESPOND_URL } from '@utils/urls'
import { updateAppConfig, updateHomeConfig } from '@redux/actions'
import { getModerateQueue, getRespondQueue, getFeedbackLink, getAboutLink, getProfile } from '@redux/selectors'

import HomePage from './home'

const mapStateToProps = (state, props) => ({
  profile: getProfile(state),
  respondQueue: getRespondQueue(state),
  moderateQueue: getModerateQueue(state),
  feedbackLink: getFeedbackLink(state),
  aboutLink: getAboutLink(state)
})
const mapDispatchToProps = (dispatch, props) => ({
  goToRespondMode: () => dispatch(push(RESPOND_URL)),
  goToModerateMode: () => true,
  goToProfile: () => dispatch(push(PROFILE_URL)),
  updateAppConfig: () => dispatch(updateAppConfig()),
  updateHomeConfig: () => dispatch(updateHomeConfig())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage)
