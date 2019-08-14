import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { DASHBOARD_URL, SETTINGS_URL } from '@utils/urls'
import { fetchExtraUserMeta, fetchProfile, uploadAvatar } from '@redux/actions'
import { getProfile, getHelpDocs } from '@redux/selectors'
import ProfilePage from './profile'

const mapStateToProps = (state, props) => ({
  profile: getProfile(state),
  helpDocs: getHelpDocs(state)
})
const mapDispatchToProps = (dispatch, props) => ({
  back: () => dispatch(push(DASHBOARD_URL)),
  updateUserMeta: () => dispatch(fetchExtraUserMeta()),
  updateProfile: () => dispatch(fetchProfile()),
  editProfile: () => dispatch(push(SETTINGS_URL)),
  uploadAvatar: file => dispatch(uploadAvatar(file))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePage)
