import React, { Component, Fragment } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'

import WelcomePage from '@pages/welcome'
import LoginPage from '@pages/login'
import createStore from '@redux/store'
import { handleAuthentication } from '@redux/actions'
import PrivateRoute from '@utils/private-route'
import { WELCOME_URL, DASHBOARD_URL } from '@utils/urls'

import 'normalize.css'
import './App.scss'

const {store, history} = createStore()

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route
              path={WELCOME_URL}
              exact
              component={props => <WelcomePage {...props} />}
            />
            <Route
              path={'/account/'}
              component={props => <LoginPage {...props} />}
            />
            <PrivateRoute
              path={DASHBOARD_URL}
              component={props => <h1>Dashboard</h1>}
            />
            <Route
              path={'/callback'}
              component={props => {
                store.dispatch(handleAuthentication(props.history))
                return null
              }}
            />
          </Switch>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default App
