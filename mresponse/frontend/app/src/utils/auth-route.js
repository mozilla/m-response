import Api from '@utils/api'
import { BASE_URL } from '@utils/urls'
import LoginPage from '@pages/login'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

function authenticatedComponent (WrappedComponent, redirect, authRequired) {
  return class extends Component {
    constructor (props) {
      super(props)
      this.state = {
        isAuthenticated: false,
        isAuthenticating: true,
        hasAccount: false
      }
    }
    async componentDidMount () {
      const api = new Api(BASE_URL)
      await api.isAuthenticated().then(
        data => {
          this.setState({
            isAuthenticated: true,
            isAuthenticating: false,
            hasAccount: data.profile.languages !== ''
          })
        }, (error) => {
          this.setState({ isAuthenticating: false })
          console.log(error)
        }
      )
    }
    render () {
      if (this.state.isAuthenticating) {
        return null
      }
      const allow = authRequired ? this.state.isAuthenticated : !this.state.isAuthenticated
      if (allow) {
        if (!this.state.hasAccount && this.state.isAuthenticated) {
          return <LoginPage {...this.props}/>
        }
        return <WrappedComponent {...this.props} />
      }
      return <Redirect to={redirect} />
    }
  }
}

const AuthRoute = ({ component: Component, redirect, authenticated = true, ...rest }) => {
  // Force trailing slash
  const path = rest.location.pathname
  if (path.slice(-1) !== '/') {
    return (
      <Route {...rest}>
        <Redirect to={path + '/'} />
      </Route>
    )
  }

  const AuthedComp = authenticatedComponent(Component, redirect, authenticated)

  return (
    <Route {...rest} render={(props) => {
      return <AuthedComp {...props} />
    }} />
  )
}

const mapStateToProps = (state, props) => ({
})

const mapDispatchToProps = dispatch => ({
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthRoute)
