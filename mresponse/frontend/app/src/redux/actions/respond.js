export const UPDATE_REVIEWS = 'UPDATE_REVIEWS'
export const UPDATE_RESPONSE = 'UPDATE_RESPONSE'

export const fetchNewReviews = (api) => async (dispatch, getState) => {
  const currentReview = await api.getReview()
  // const nextReview = await api.getReview()
  return dispatch({
    type: UPDATE_REVIEWS,
    currentReview
    // nextReview
  })
}

export const fetchNextReview = (api) => async (dispatch, getState) => {
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
}

export const updateCurrentResponse = response => ({
  type: UPDATE_RESPONSE,
  response
})

export const submitResponse = (api, cb) => async (dispatch, getState) => {
  const { respond: { currentReview, currentReviewResponse } } = getState()
  try {
    const res = await api.submitResponse(currentReview.id, currentReviewResponse)
    cb(res.detail, null)
    return dispatch(fetchNextReview(api))
  } catch (e) {
    cb(null, e)
  }
}

export const skipReview = (api) => async (dispatch, getState) => {
  const { respond: { currentReview } } = getState()
  try {
    await api.skipReview(currentReview.id)
    return dispatch(fetchNextReview(api))
  } catch (e) {
    console.error(e)
  }
}
