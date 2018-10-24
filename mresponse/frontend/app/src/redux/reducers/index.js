import { combineReducers } from 'redux'

import errors from './errors'
import config from './config'
import respond from './respond'
import moderate from './moderate'

export default combineReducers({
  errors,
  config,
  respond,
  moderate
})
