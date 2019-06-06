import { connectApi } from '@redux/util/api-wrapper'

export const SET_LEADERBOARD = 'SET_LEADERBOARD'

export const fetchLeaderboard = () => connectApi(api =>
  async (dispatch) => {
    try {
      const leaderboard = await api.getLeaderboard()
      return dispatch({
        type: SET_LEADERBOARD,
        leaderboard
      })
    } catch (err) {
      console.error(err)
    }
  }
)
