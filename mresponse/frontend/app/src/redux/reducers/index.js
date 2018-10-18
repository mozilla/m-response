import { combineReducers } from 'redux'

import auth from './auth'
import errors from './errors'
import config from './config'
import respond from './respond'

export default combineReducers({
  auth,
  errors,
  config,
  respond
})
