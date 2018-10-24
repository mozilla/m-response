import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { SETTINGS_URL, PROFILE_URL } from '@utils/urls'
import { updateProfile } from '@redux/actions'
import {
  getProfile,
  getSupportedLanguages,
  getLegalUrl,
  getPrivacyUrl,
  getCookiesUrl
} from '@redux/selectors'
import SettingsPage from './settings'

const mapStateToProps = (state, props) => ({
  profile: getProfile(state),
  supportedLanguages: getSupportedLanguages(state),
  legalUrl: getLegalUrl(state),
  privacyUrl: getPrivacyUrl(state),
  cookiesUrl: getCookiesUrl(state)
})
const mapDispatchToProps = (dispatch, props) => ({
  back: () => dispatch(push(PROFILE_URL)),
  editProfile: () => dispatch(push(SETTINGS_URL)),
  saveProfile: profile => dispatch(updateProfile(profile))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPage)
