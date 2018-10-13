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
}
