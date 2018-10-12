import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { PROFILE_URL } from '@utils/urls'
import { updateAppConfig, updateHomeConfig } from '@redux/actions'
import HomePage from './home'

const mapStateToProps = (state, props) => ({
  profile: state.auth.profile,
  respondQueue: state.config.homeConfig['respond_queue'] || 0,
  moderateQueue: state.config.homeConfig['moderate_queue'] || 0,
  feedbackLink: state.config.appConfig['feedback_url'] || '#',
  aboutLink: state.config.appConfig['about_url'] || '#'
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
