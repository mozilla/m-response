import React, { Component, Fragment } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'

import WelcomePage from '@pages/welcome'
import LoginPage from '@pages/login/login'
import createStore from '@redux/store'
import 'normalize.css'
import './App.scss'

const store = createStore()

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route
              path={'/'}
              exact
              component={props => <WelcomePage {...props} />}
            />
            <Route
              path={'/account/'}
              component={props => 
                <LoginPage 
                  {...props}
                  back={() => props.history.push('/')}
                  login={() => console.log('Login')}
                  createAccount={() => console.log('Create Account')}
                  forgotPassword={() => console.log('Forgot Password')}
                />
              }
            />
          </Switch>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default App
