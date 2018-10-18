import faker from 'faker'

import { staticAsset } from '@utils/urls'

export default class Api {
  async getConfig () {
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

  async getHomeConfig () {
    return {
      'respond_queue': 31240,
      'moderate_queue': 1800
    }
  }

  async getExtraUserMeta () {
    return {
      karma: {
        points: 180,
        responsesCount: 50,
        moderationsCount: 20
      }
    }
  }

  async getReview () {
    const res = {
      'id': faker.random.number(100000),
      'android_sdk_version': 22,
      'android_version': '7.1',
      'author_name': faker.name.findName(),
      'application': {
        'name': 'Firefox',
        'package': 'org.mozilla.firefox'
      },
      'application_version': {
        'name': '1.0.1',
        'code': 68
      },
      'review_text': faker.lorem.paragraphs(1),
      'review_rating': faker.random.number(3),
      'last_modified': faker.date.past(1),
      'assignment_expires_at': Date.now() + 3600000,
      'response_url': 'https://mresponse-staging.herokuapp.com/api/respond/1/',
      'skip_url': 'https://mresponse-staging.herokuapp.com/api/review/skip/1/'
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
      lastModified: res['last_modified'],
      assignmentExpiration: res['assignment_expires_at']
    }
  }

  async submitResponse (reviewId, response) {
    if (reviewId && response) {
      return { detail: 'Thank you for your effort and so making Mozilla better for all of us!' }
    } else {
      throw Error({ detail: 'An error happened!' })
    }
  }

  async skipReview (reviewId) {
    if (reviewId) {
      return { detail: 'Review Skipped!' }
    } else {
      throw Error({ detail: 'An error happened!' })
    }
  }
}
