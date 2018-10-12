import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { PROFILE_URL } from '@utils/urls'
import { updateAppConfig, updateHomeConfig } from '@redux/actions'
import { moderateQueue, respondQueue, feedbackLink, aboutLink, profile } from '@redux/selectors'
import HomePage from './home'

const mapStateToProps = (state, props) => ({
  profile: profile(state),
  respondQueue: respondQueue(state),
  moderateQueue: moderateQueue(state),
  feedbackLink: feedbackLink(state),
  aboutLink: aboutLink(state)
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
