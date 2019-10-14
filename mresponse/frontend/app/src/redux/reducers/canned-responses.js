import { SET_CANNED_RESONSES } from '@redux/actions'

const initial = []

export default (state = initial, action) => {
  switch (action.type) {
    case SET_CANNED_RESONSES:
      const { cannedResponses } = action
      state = cannedResponses
      return state

    default:
      return state
  }
}
