import faker from 'faker'

import { staticAsset } from '@utils/urls'

export default class Api {
  getConfig() {
    return {
      'languages': [
        {
          'id': 'de',
          'display_name': 'German'
        },
        {
          'id': 'en',
          'display_name': 'English'
        },
        {
          'id': 'fr',
          'display_name': 'French'
        }
      ],
      'response_guide_book_url': 'http://dgg.gg',
      'feedback_url': 'https://github.com/torchbox/m-response/issues/new',
      'about_url': 'https://www.mozilla.org/en-US/about/'
    }
  }

  getHomeConfig() {
    return {
      'respond_queue': 31240,
      'moderate_queue': 1800
    }
  }

  getReview() {
    const res =  {
      "id": faker.random.number(100000),
      "android_sdk_version": 22,
      "android_version": "7.1",
      "author_name": faker.name.findName(),
      "application": {
        "name": "Firefox",
        "package": "org.mozilla.firefox"
      },
      "application_version": {
        "name": "1.0.1",
        "code": 68
      },
      "review_text":  faker.lorem.paragraphs(1),
      "review_rating": faker.random.number(3),
      "last_modified": faker.date.past(1),
      "assignment_expires_at": Date.now() + 3600000,
      "response_url": "https://mresponse-staging.herokuapp.com/api/respond/1/",
      "skip_url": "https://mresponse-staging.herokuapp.com/api/review/skip/1/"
    }

    return {
      id: res['id'],
      author: res['author_name'],
      rating: res['rating'],
      text: res['review_text'],
      product: {
        name: res['application']['name'] + ' ' + res['application_version']['name'],
        image: staticAsset('media/firefox.png')
      },
      androidVersion: 'Android ' + res['android_version'],
      dateSubmitted: res['last_modified']
    }
  }

  submitResponse(reviewId, response) {
    return new Promise((resolve, reject) => {
      if (reviewId && response) {
        resolve({ detail: 'Thank you for your effort and so making Mozilla better for all of us!' })
      } else {
        reject(Error({ detail: 'An error happened!' }))
      }
    })
  }

  skipReview(reviewId) {
    return new Promise((resolve, reject) => {
      if (reviewId) {
        resolve({ detail: 'Review Skipped!' })
      } else {
        reject(Error({ detail: 'An error happened!' }))
      }
    })
  }
}
