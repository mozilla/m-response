export default class Api {
  getConfig () {
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
      'response_guide_book_url': 'http://dgg.gg'
    }
  }

  getHomeConfig () {
    return {
      'respond_queue': 31240,
      'moderate_queue': 1800,
      'feedback_url': 'https://github.com/torchbox/m-response/issues/new',
      'about_url': 'https://www.mozilla.org/en-US/about/'
    }
  }
}
