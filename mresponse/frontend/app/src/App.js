import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { PersistGate } from 'redux-persist/integration/react'

import WelcomePage from '@pages/welcome'
import HomePage from '@pages/home'
import ProfilePage from '@pages/profile'
import SettingsPage from '@pages/settings'
import RespondPage from '@pages/respond'
import ModeratePage from '@pages/moderate'

import createStore from '@redux/store'
import { loginCallback, logoutCallback, updateAppConfig } from '@redux/actions'
import AuthRoute from '@utils/auth-route'
import {
  WELCOME_URL,
  LOGIN_URL,
  DASHBOARD_URL,
  CALLBACK_URL,
  LOGOUT_URL,
  PROFILE_URL,
  SETTINGS_URL,
  RESPOND_URL,
  MODERATE_URL
} from '@utils/urls'

import 'normalize.css'
import './App.scss'

const { store, history, persistor } = createStore()

class App extends Component {
  render () {
    store.dispatch(updateAppConfig())
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
                component={props => <HomePage {...props} />}
              />
              <AuthRoute
                path={PROFILE_URL}
                redirect={LOGIN_URL}
                exact
                component={props => <ProfilePage {...props} />}
              />
              <AuthRoute
                path={SETTINGS_URL}
                redirect={LOGIN_URL}
                exact
                component={props => <SettingsPage {...props} />}
              />
              <AuthRoute
                path={RESPOND_URL}
                redirect={LOGIN_URL}
                component={props => <RespondPage {...props} />}
              />
              <AuthRoute
                path={MODERATE_URL}
                redirect={LOGIN_URL}
                component={props => <ModeratePage {...props} />}
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
