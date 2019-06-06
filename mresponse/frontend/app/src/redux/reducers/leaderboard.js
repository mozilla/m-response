import { SET_LEADERBOARD } from '@redux/actions'

const initialState = []

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LEADERBOARD: {
      return action.leaderboard
    }
    default:
      return state
  }
}
