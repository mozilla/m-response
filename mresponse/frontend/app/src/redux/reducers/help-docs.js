import { SET_HELP_DOCS } from '@redux/actions'

const initial = []

export default (state = initial, action) => {
  switch (action.type) {
    case SET_HELP_DOCS:
      const { helpDocs } = action
      state = helpDocs
      return state

    default:
      return state
  }
}
