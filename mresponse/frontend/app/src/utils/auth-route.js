import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import { logout } from '@redux/actions'

const AuthRoute = ({ component: Component, redirect, authenticated = true, ...rest }) => {
  // Auto-Logout if 10 mins within token expiration
  if (rest.expireTime != null && rest.expireTime < (Date.now() - 600000)) {
    rest.logout()
  }

  // Force trailing slash
  const path = rest.location.pathname
  if (path.slice(-1) !== '/') {
    return (
      <Route {...rest}>
        <Redirect to={path + '/'} />
      </Route>
    )
  }

  return (
    <Route {...rest} render={(props) => {
      const condition = authenticated ? rest.isAuthenticated : !rest.isAuthenticated
      return condition
        ? <Component {...props} />
        : <Redirect to={redirect} />
    }} />
  )
}

const mapStateToProps = (state, props) => ({
  isAuthenticated: state.auth.isAuthenticated,
  expireTime: state.auth.expiresAt
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthRoute)
