import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import { WELCOME_URL } from '@utils/urls'

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => {
    console.log(rest)
    return rest.isAuthenticated
      ? <Component {...props} />
      : <Redirect to={WELCOME_URL} />
  }}/>
)

const mapStateToProps = (state, props) => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(
  mapStateToProps
)(PrivateRoute)