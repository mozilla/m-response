import Api from '@utils/api'
import { BASE_URL } from '@utils/urls'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

function authenticatedComponent (WrappedComponent, redirect, authRequired) {
  return class extends Component {
    constructor (props) {
      super(props)
      this.state = {
        isAuthenticated: false,
        isAuthenticating: true
      }
    }
    componentDidMount () {
      const api = new Api(BASE_URL)
      api.isAuthenticated().then(
        data => {
          console.log(`Authentication data ${JSON.stringify(data)}`)
          this.setState({
            isAuthenticated: true,
            isAuthenticating: false
          })
        }, (error) => {
          this.setState({ isAuthenticating: false })
          console.log(JSON.stringify(error))
        }
      )
    }
    render () {
      if (this.state.isAuthenticating) {
        return null
      }
      const allow = authRequired ? this.state.isAuthenticated : true
      if (allow) {
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
