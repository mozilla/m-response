import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { PersistGate } from 'redux-persist/integration/react'

import WelcomePage from '@pages/welcome'
import LoginPage from '@pages/login'
import createStore from '@redux/store'
import { loginCallback, logoutCallback, logout } from '@redux/actions'
import AuthRoute from '@utils/auth-route'
import {
  WELCOME_URL,
  LOGIN_URL,
  DASHBOARD_URL,
  CALLBACK_URL,
  LOGOUT_URL
} from '@utils/urls'

import 'normalize.css'
import './App.scss'

const { store, history, persistor } = createStore()

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConnectedRouter history={history}>
            <Switch>
              <AuthRoute
                exact
                path={WELCOME_URL}
                redirect={DASHBOARD_URL}
                authenticated={false}
                component={props => <WelcomePage {...props} />}
              />
              <AuthRoute
                path={'/account/'}
                redirect={DASHBOARD_URL}
                authenticated={false}
                component={props => <LoginPage {...props} />}
              />
              <AuthRoute
                path={DASHBOARD_URL}
                redirect={LOGIN_URL}
                component={props => (
                  <div>
                    <h1>Dashboard</h1>
                    <button onClick={() => store.dispatch(logout())}>Logout</button>
                  </div>
                )}
              />
              <Route
                path={CALLBACK_URL}
                component={props => {
                  store.dispatch(loginCallback())
                  return null
                }}
              />
              <Route
                path={LOGOUT_URL}
                component={props => {
                  store.dispatch(logoutCallback())
                  return null
                }}
              />
            </Switch>
          </ConnectedRouter>
        </PersistGate>
      </Provider>
    )
  }
}

export default App
