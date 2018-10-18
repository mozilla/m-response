import { connectApi } from '@redux/util/api-wrapper'

export const UPDATE_REVIEWS = 'UPDATE_REVIEWS'
export const UPDATE_RESPONSE = 'UPDATE_RESPONSE'

export const fetchNewReviews = (cb = () => null) => connectApi(api => async (dispatch, getState) => {
  try {
    const currentReview = await api.getReview()
    // const nextReview = await api.getReview()
    cb(null, null)
    return dispatch({
      type: UPDATE_REVIEWS,
      currentReview
      // nextReview
    })
  } catch (err) {
    cb(null, err)
    return dispatch({
      type: UPDATE_REVIEWS,
      currentReview: null
    })
  }
})

export const fetchNextReview = (cb = () => null) => connectApi(api => async (dispatch, getState) => {
  const { respond } = getState()
  if (respond.nextReview != null) {
    const nextReview = await api.getReview()
    cb(null, null)
    return dispatch({
      type: UPDATE_REVIEWS,
      currentReview: respond.nextReview,
      nextReview
    })
  } else {
    return dispatch(fetchNewReviews(cb))
  }
})

export const updateCurrentResponse = response => ({
  type: UPDATE_RESPONSE,
  response
})

export const submitResponse = (cb = () => null) => connectApi(api => async (dispatch, getState) => {
  const { respond: { currentReview, currentReviewResponse } } = getState()
  try {
    if (currentReview) {
      const res = await api.submitResponse(currentReview.id, currentReviewResponse)
      cb(res.detail, null)
      return dispatch(fetchNextReview(cb))
    }
  } catch (e) {
    cb(null, e)
  }
})

export const skipReview = (cb = () => null) => connectApi(api => async (dispatch, getState) => {
  const { respond: { currentReview } } = getState()
  try {
    await api.skipReview(currentReview.id)
    return dispatch(fetchNextReview(cb))
  } catch (e) {
    console.error(e)
  }
})
