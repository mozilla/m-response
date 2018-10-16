import { connectApi } from '@redux/util/api-wrapper'

export const UPDATE_REVIEWS = 'UPDATE_REVIEWS'
export const UPDATE_RESPONSE = 'UPDATE_RESPONSE'

export const fetchNewReviews = () => connectApi(api => async (dispatch, getState) => {
  const currentReview = await api.getReview()
  console.log(currentReview)
  // const nextReview = await api.getReview()
  return dispatch({
    type: UPDATE_REVIEWS,
    currentReview
    // nextReview
  })
})

export const fetchNextReview = () => connectApi(api => async (dispatch, getState) => {
  const { respond } = getState()
  if (respond.nextReview != null) {
    const nextReview = await api.getReview()
    return dispatch({
      type: UPDATE_REVIEWS,
      currentReview: respond.nextReview,
      nextReview
    })
  } else {
    return dispatch(fetchNewReviews(api))
  }
})

export const updateCurrentResponse = response => ({
  type: UPDATE_RESPONSE,
  response
})

export const submitResponse = cb => connectApi(api => async (dispatch, getState) => {
  const { respond: { currentReview, currentReviewResponse } } = getState()
  try {
    if (currentReview) {
      const res = await api.submitResponse(currentReview.id, currentReviewResponse)
      console.log(res.detail)
      cb(res.detail, null)
      return dispatch(fetchNextReview())
    }
  } catch (e) {
    cb(null, e)
  }
})

export const skipReview = () => connectApi(api => async (dispatch, getState) => {
  const { respond: { currentReview } } = getState()
  try {
    await api.skipReview(currentReview.id)
    return dispatch(fetchNextReview(api))
  } catch (e) {
    console.error(e)
  }
})
