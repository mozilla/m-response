import { UPDATE_APP_CONFIG, UPDATE_HOME_CONFIG } from '@redux/actions'

const initial = {
  appConfig: null,
  homeConfig: null
}

export default (state = initial, action) => {
  switch (action.type) {
    case UPDATE_APP_CONFIG: {
      const { appConfig } = action
      return Object.assign({}, state, {
        appConfig
      })
    }

    case UPDATE_HOME_CONFIG: {
      const { homeConfig } = action
      return Object.assign({}, state, {
        homeConfig
      })
    }

    default:
      return state
  }
}
