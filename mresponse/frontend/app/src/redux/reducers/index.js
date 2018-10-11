import { combineReducers } from 'redux'

import auth from './auth'
import errors from './errors'
import config from './config'

export default combineReducers({
  auth,
  errors,
  config
})
