const emptyResponse = {
  text: '',
  review: {
    id: 0,
    author: '',
    rating: 0,
    text: '',
    product: {
      name: '',
      image: ''
    },
    androidVersion: '',
    lastModified: 0,
    assignmentExpiration: 0
  }
}

export const getCurrentResponse = state => state.moderate.currentResponse || emptyResponse
