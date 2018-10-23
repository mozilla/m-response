import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { DASHBOARD_URL, SETTINGS_URL } from '@utils/urls'
import { fetchExtraUserMeta, uploadAvatar } from '@redux/actions'
import { getProfile } from '@redux/selectors'
import ProfilePage from './profile'

const mapStateToProps = (state, props) => ({
  profile: getProfile(state)
})
const mapDispatchToProps = (dispatch, props) => ({
  back: () => dispatch(push(DASHBOARD_URL)),
  updateKarma: () => dispatch(fetchExtraUserMeta()),
  editProfile: () => dispatch(push(SETTINGS_URL)),
  uploadAvatar: file => dispatch(uploadAvatar(file))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePage)
