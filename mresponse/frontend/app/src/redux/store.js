import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import rootReducer from './reducers/index'

const history = createBrowserHistory()

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['errors']
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export default initialState => {
  const store = createStore(
    connectRouter(history)(persistedReducer),
    initialState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history),
        thunk
      )
    )
  )
  const persistor = persistStore(store)
  return { store, history, persistor }
}
