import { UPDATE_MOD_RESPONSE, UPDATE_MODERATION } from '@redux/actions'

const initial = {
  currentResponseModeration: null,
  currentResponse: null
}

export default (state = initial, action) => {
  switch (action.type) {
    case UPDATE_MOD_RESPONSE: {
      const {
        response
      } = action
      return Object.assign({}, state, {
        currentResponse: response,
        currentResponseModeration: null
      })
    }

    case UPDATE_MODERATION: {
      const { moderation } = action
      return Object.assign({}, state, {
        currentResponseModeration: moderation
      })
    }

    default:
      return state
  }
}
