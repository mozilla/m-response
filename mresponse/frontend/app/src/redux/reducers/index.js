import { combineReducers } from 'redux'

import auth from './auth'
import errors from './errors'
import config from './config'
import respond from './respond'
import moderate from './moderate'

export default combineReducers({
  auth,
  errors,
  config,
  respond,
  moderate
})
