import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { DASHBOARD_URL, SETTINGS_URL } from '@utils/urls'
import { updateAppConfig, updateHomeConfig, logout } from '@redux/actions'
import { getModerateQueue, getRespondQueue, getFeedbackUrl, getAboutUrl, getProfile } from '@redux/selectors'
import ProfilePage from './profile'

const mapStateToProps = (state, props) => ({
  profile: getProfile(state)
})
const mapDispatchToProps = (dispatch, props) => ({
  back: () => dispatch(push(DASHBOARD_URL)),
  editProfile: () => dispatch(push(SETTINGS_URL))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePage)
