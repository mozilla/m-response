import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { PersistGate } from 'redux-persist/integration/react'

import WelcomePage from '@pages/welcome'
import HomePage from '@pages/home'
import ProfilePage from '@pages/profile'
import SettingsPage from '@pages/settings'
import RespondPage from '@pages/respond'
import ModeratePage from '@pages/moderate'
import NotFoundPage from '@pages/notfound'

import createStore from '@redux/store'
import { updateAppConfig } from '@redux/actions'
import AuthRoute from '@utils/auth-route'
import {
  WELCOME_URL,
  DASHBOARD_URL,
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
                component={WelcomePage}
              />
              <AuthRoute
                path={DASHBOARD_URL}
                redirect={WELCOME_URL}
                component={HomePage}
              />
              <AuthRoute
                path={PROFILE_URL}
                redirect={WELCOME_URL}
                exact
                component={ProfilePage}
              />
              <AuthRoute
                path={SETTINGS_URL}
                redirect={WELCOME_URL}
                exact
                component={SettingsPage}
              />
              <AuthRoute
                path={RESPOND_URL}
                redirect={WELCOME_URL}
                component={RespondPage}
              />
              <AuthRoute
                path={MODERATE_URL}
                redirect={WELCOME_URL}
                component={ModeratePage}
              />
              <Route
                component={props => <NotFoundPage isAuthenticated={store.getState().profile.profile} {...props} />}
              />
            </Switch>
          </ConnectedRouter>
        </PersistGate>
      </Provider>
    )
  }
}

export default App
