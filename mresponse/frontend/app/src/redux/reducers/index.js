import { combineReducers } from 'redux'

import errors from './errors'
import profile from './profile'
import config from './config'
import respond from './respond'
import moderate from './moderate'
import leaderboard from './leaderboard'
import cannedResponses from './canned-responses'

export default combineReducers({
  errors,
  config,
  respond,
  moderate,
  profile,
  leaderboard,
  cannedResponses
})
