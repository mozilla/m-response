import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers/index'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

export default initialState => {
  const store = createStore(
    connectRouter(history)(rootReducer),
    initialState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history),
        thunk
      )
    )
  )
  return {store, history}
}
