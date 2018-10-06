import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

const AuthRoute = ({ component: Component, redirect, authenticated = true, ...rest }) => (
  <Route {...rest} render={(props) => {
    const condition = authenticated ? rest.isAuthenticated : !rest.isAuthenticated
    return condition
      ? <Component {...props} />
      : <Redirect to={redirect} />
  }}/>
)

const mapStateToProps = (state, props) => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(
  mapStateToProps
)(AuthRoute)
