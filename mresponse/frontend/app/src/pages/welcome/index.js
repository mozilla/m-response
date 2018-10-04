import React from 'react'
import { connect } from 'react-redux'

import { LOGIN_URL, SIGNUP_URL } from '@utils/urls'
import WelcomePage from './welcome'

const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch, props) => ({
  login: () => props.history.push(LOGIN_URL),
  continue: () => props.history.push(SIGNUP_URL),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WelcomePage)