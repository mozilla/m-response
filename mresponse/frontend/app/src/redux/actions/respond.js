import { connectApi } from '@redux/util/api-wrapper'
import { getSpokenLanguages } from '@redux/selectors'

export const UPDATE_REVIEWS = 'UPDATE_REVIEWS'
export const UPDATE_RESPONSE = 'UPDATE_RESPONSE'

export const fetchNewReviews = (cb = () => null) =>
  connectApi(api =>
    async (dispatch, getState) => {
      const languages = getSpokenLanguages(getState())
      try {
        const currentReview = await api.getReview(languages, false)
        let nextReview = null
        try {
          nextReview = await api.getReview(languages, true)
        } catch (err) {
          console.log("Couldn't fetch next review:", err)
        }
        cb(null, null)
        return dispatch({
          type: UPDATE_REVIEWS,
          currentReview,
          nextReview
        })
      } catch (err) {
        cb(null, err)
        return dispatch({
          type: UPDATE_REVIEWS,
          currentReview: null
        })
      }
    }
  )

export const fetchNextReview = (cb = () => null) =>
  connectApi(api =>
    async (dispatch, getState) => {
      const state = getState()
      const languages = getSpokenLanguages(state)
      if (state.respond.nextReview != null) {
        const nextReview = await api.getReview(languages, true)
        cb(null, null)
        return dispatch({
          type: UPDATE_REVIEWS,
          currentReview: state.respond.nextReview,
          nextReview
        })
      } else {
        return dispatch(fetchNewReviews())
      }
    }
  )

export const updateCurrentResponse = response => ({
  type: UPDATE_RESPONSE,
  response
})

export const submitResponse = (cb = () => null) =>
  connectApi(api =>
    async (dispatch, getState) => {
      const { respond: { currentReview, currentReviewResponse } } = getState()
      try {
        if (currentReview) {
          const res = await api.submitResponse(currentReview.id, currentReviewResponse)
          cb(res.detail, null)
          return dispatch(fetchNewReviews())
        }
      } catch (e) {
        cb(null, e)
      }
    }
  )

export const skipReview = (cb = () => null) =>
  connectApi(api =>
    async (dispatch, getState) => {
      const { respond: { currentReview } } = getState()
      try {
        await api.skipReview(currentReview.id)
        return dispatch(fetchNewReviews(cb))
      } catch (e) {
        console.error(e)
      }
    }
  )
