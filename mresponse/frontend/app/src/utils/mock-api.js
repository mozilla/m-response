import faker from 'faker'

import { staticAsset } from '@utils/urls'

export default class Api {
  
  getConfig () {
    return {
      'languages': [
        {
          'id': 'DE',
          'display_name': 'German'
        },
        {
          'id': 'EN',
          'display_name': 'English'
        },
        {
          'id': 'FR',
          'display_name': 'French'
        }
      ],
      'response_guide_book_url': 'http://dgg.gg',
      'feedback_url': 'https://github.com/torchbox/m-response/issues/new',
      'about_url': 'https://www.mozilla.org/en-US/about/',
      'privacy_url': '#',
      'legal_url': '#',
      'cookies_url': '#'
    }
  }

  getHomeConfig () {
    return {
      'respond_queue': 31240,
      'moderate_queue': 1800
    }
  }

  getExtraUserMeta () {
    return {
      karma: {
        points: 180,
        responsesCount: 50,
        moderationsCount: 20
      }
    }
  }

  getReview () {
    return {
      id: faker.random.number(100000),
      author: faker.name.findName(),
      rating: faker.random.number(3),
      text: faker.lorem.paragraphs(1),
      product: {
        name: 'Firefox 59.0.2',
        image: staticAsset('media/firefox.png')
      },
      androidVersion: 'Android 7.07',
      dateSubmitted: faker.date.past(1)
    }
  }

  submitResponse (reviewId, response) {
    return new Promise((resolve, reject) => {
      if (reviewId && response) {
        resolve({ detail: 'Thank you for your effort and so making Mozilla better for all of us!' })
      } else {
        reject(Error({ detail: 'An error happened!' }))
      }
    })
  }

  skipReview (reviewId) {
    return new Promise((resolve, reject) => {
      if (reviewId) {
        resolve({ detail: 'Review Skipped!' })
      } else {
        reject(Error({ detail: 'An error happened!' }))
      }
    })
  }

}
