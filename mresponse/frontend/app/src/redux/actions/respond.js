import Api from '@utils/mock-api'

export const UPDATE_REVIEWS = 'UPDATE_REVIEWS'
export const UPDATE_RESPONSE = 'UPDATE_RESPONSE'

const api = new Api()

export const fetchNewReviews = () => async (dispatch, getState) => {
  const currentReview = await api.getReview()
  // const nextReview = await api.getReview()
  return dispatch({
    type: UPDATE_REVIEWS,
    currentReview
    // nextReview
  })
}

export const fetchNextReview = () => async (dispatch, getState) => {
  const { respond } = getState()
  if (respond.nextReview != null) {
    const nextReview = await api.getReview()
    return dispatch({
      type: UPDATE_REVIEWS,
      currentReview: respond.nextReview,
      nextReview
    })
  } else {
    return dispatch(fetchNewReviews())
  }
}

export const updateCurrentResponse = response => ({
  type: UPDATE_RESPONSE,
  response
})

export const submitResponse = cb => async (dispatch, getState) => {
  const { respond: { currentReview, currentReviewResponse } } = getState()
  try {
    const res = await api.submitResponse(currentReview.id, currentReviewResponse)
    cb(res.detail, null)
    return dispatch(fetchNextReview())
  } catch (e) {
    cb(null, e)
  }
}

export const skipReview = () => async (dispatch, getState) => {
  const { respond: { currentReview } } = getState()
  try {
    await api.skipReview(currentReview.id)
    return dispatch(fetchNextReview())
  } catch (e) {
    console.error(e)
  }
}
