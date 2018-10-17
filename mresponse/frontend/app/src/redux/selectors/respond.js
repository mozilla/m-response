const emptyReview = {
  id: 0,
  author: '',
  rating: 0,
  text: '',
  product: {
    name: '',
    image: ''
  },
  androidVersion: '',
  dateSubmitted: 0,
  assignmentExpiration: 0
}

export const getCurrentReview = state => state.respond.currentReview || emptyReview
export const getNextReview = state => state.respond.nextReview || emptyReview
