import { connect } from 'react-redux'
import { push } from 'connected-react-router'

import { WELCOME_URL } from '@utils/urls'
import { getSupportedLanguages } from '@redux/selectors'
import { updateProfile } from '@redux/actions'
import LoginPage from './login'

const mapStateToProps = state => {
  const status = state.errors.loginError
  return {
    status: status ? `Error: ${status}` : null,
    supportedLanguages: getSupportedLanguages(state)
  }
}
const mapDispatchToProps = (dispatch, props) => ({
  back: () => dispatch(push(WELCOME_URL)),
  updateProfile: profile => dispatch(updateProfile(profile))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)
