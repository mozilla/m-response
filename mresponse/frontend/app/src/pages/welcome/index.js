import React from 'react'
import { connect } from 'react-redux'
import {push} from 'connected-react-router'

import { LOGIN_URL, SIGNUP_URL } from '@utils/urls'
import WelcomePage from './welcome'

const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch, props) => ({
  login: () => dispatch(push(LOGIN_URL)),
  continue: () => dispatch(push(SIGNUP_URL)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WelcomePage)