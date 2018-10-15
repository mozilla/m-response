import { UPDATE_REVIEWS, UPDATE_RESPONSE } from '@redux/actions'

const initial = {
  currentReviewResponse: '',
  currentReview: {},
  nextReview: null
}

export default (state = initial, action) => {
  switch (action.type) {
    case UPDATE_REVIEWS: {
      const {
        currentReview
        // nextReview
      } = action
      return Object.assign({}, state, {
        currentReview,
        // nextReview,
        currentReviewResponse: ''
      })
    }

    case UPDATE_RESPONSE: {
      const { response } = action
      return Object.assign({}, state, {
        currentReviewResponse: response
      })
    }

    default:
      return state
  }
}
