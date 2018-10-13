import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { PROFILE_URL } from '@utils/urls'
import { updateAppConfig, updateHomeConfig } from '@redux/actions'
import { getModerateQueue, getRespondQueue, getFeedbackUrl, getAboutUrl, getProfile } from '@redux/selectors'
import HomePage from './home'

const mapStateToProps = (state, props) => ({
  respondQueue: getRespondQueue(state),
  moderateQueue: getModerateQueue(state),
  feedbackLink: getFeedbackUrl(state),
  aboutLink: getAboutUrl(state),
  profile: getProfile(state)
})
const mapDispatchToProps = (dispatch, props) => ({
  goToRespondMode: () => true,
  goToModerateMode: () => true,
  goToProfile: () => dispatch(push(PROFILE_URL)),
  updateAppConfig: () => dispatch(updateAppConfig()),
  updateHomeConfig: () => dispatch(updateHomeConfig())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage)
