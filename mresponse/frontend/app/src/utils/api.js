import { staticAsset } from '@utils/urls'
import Cookie from 'js-cookie'

export default class Api {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
  }

  async fetch (path, options = {}, isPublic = false) {
    let headers = options.headers || {}
    options.headers = headers

    return fetch(`${this.baseUrl}${path}`, options)
  }

  async getConfig () {
    return this.fetch(`/api/config/`, {}, true)
      .then(response => response.json())
  }

  async getHomeConfig () {
    return this.fetch(`/api/homepage/`)
      .then(response => response.json())
  }

  async getExtraUserMeta () {
    const res = await this.fetch(`/api/users/me/`)
    return res.json().then(json => {
      return {
        karma: {
          points: json.profile.karma_points,
          responsesCount: json.profile.response_count,
          moderationsCount: json.profile.moderation_count
        }
      }
    })
  }

  async getProfile () {
    const res = await this.fetch(`/api/users/me/`)
    return res.json().then(json => {
      json.profile.id = json.username
      json.profile.email = json.email
      return {
        profile: json.profile
      }
    })
  }

  serializeReview (json) {
    return {
      id: json.id,
      author: json.author_name,
      rating: json.review_rating,
      text: json.review_text,
      product: {
        name: json.application.name,
        package: json.application.package,
        version: json.application_version,
        image: staticAsset('media/firefox.png') // TODO
      },
      androidVersion: json.android_version,
      lastModified: new Date(json.last_modified)
    }
  }

  generateLanguageParam (languages) {
    return `lang=${languages.join(',')}`
  }

  async getReview (languages, getNextReview = false) {
    let params = '?'
    if (languages) {
      params = params + this.generateLanguageParam(languages)
    }

    const url = getNextReview
      ? `/api/review/next/${params}`
      : `/api/review/${params}`

    let response = await this.fetch(url)
    if (response.status === 200) {
      return response.json().then(json => {
        return this.serializeReview(json)
      })
    } else if (response.status === 404) {
      return response.json().then(json => {
        throw json.detail
      })
    } else if (response.status === 401) {
      // User is not logged in
    }
  }

  async getResponse (languages) {
    let params = '?'
    if (languages && languages.length) {
      params = params + this.generateLanguageParam(languages)
    }

    let response = await this.fetch(`/api/response/${params}`)
    if (response.status === 200) {
      return response.json().then(json => {
        return {
          id: json.id,
          text: json.text,
          review: this.serializeReview(json.review),
          moderationUrl: json.moderation_url,
          submittedAt: new Date(json.submitted_at)
        }
      })
    } else if (response.status === 404) {
      return response.json().then(json => {
        throw json.detail
      })
    } else if (response.status === 401) {
      // User is not logged in
    }
  }

  async submitResponse (reviewId, response) {
    await this.fetch(`/api/response/create/${reviewId}/`, {
      method: 'POST',
      body: JSON.stringify({
        text: response
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookie.get('csrftoken')
      }
    })
    return { detail: 'Thank you for your effort and so making Mozilla better for all of us!' }
  }

  async submitModeration (responseId, moderation) {
    let response = await this.fetch(`/api/moderation/create/${responseId}/`, {
      method: 'POST',
      body: JSON.stringify(moderation),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookie.get('csrftoken')
      }
    })

    if (response.status !== 201) {
      const errorMessage = { detail: 'Unable to submit moderation' }
      throw errorMessage
    }

    return { detail: 'Thank you for your effort and so making Mozilla better for all of us!' }
  }

  async submitApproval (responseId) {
    let response = await this.fetch(`/api/moderation/approve/${responseId}/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': Cookie.get('csrftoken')
      }
    })

    if (response.status !== 200) {
      const errorMessage = { detail: 'Unable to approve the response' }
      throw errorMessage
    }

    return { detail: 'Thank you for your effort and so making Mozilla better for all of us!' }
  }

  async skipReview (reviewId) {
    await this.fetch(`/api/review/skip/${reviewId}/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': Cookie.get('csrftoken')
      }
    })
  }

  async skipResponse (responseId) {
    await this.fetch(`/api/response/skip/${responseId}/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': Cookie.get('csrftoken')
      }
    })
  }

  async uploadAvatar (file) {
    const formData = new FormData()
    formData.append('image', file)
    const res = await this.fetch(`/api/images/upload/`, {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRFToken': Cookie.get('csrftoken')
      }
    })
    return res.json().then(json => json.src)
  }

  async updateUserMeta (file) {
    const formData = new FormData()
    formData.append('image', file)
    const res = await this.fetch(`/api/images/upload/`, {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRFToken': Cookie.get('csrftoken')
      }
    })
    return res.json().then(json => json.src)
  }

  async updateProfile (metadata) {
    const res = await this.fetch(`/api/users/me/usermeta/`, {
      method: 'POST',
      body: JSON.stringify(metadata),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookie.get('csrftoken')
      }
    })
    return res.json().then(json => {
      return json.src
    })
  }

  isAuthenticated () {
    return this.fetch(`/api/users/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        return response.json()
      }
      throw response
    })
  }
}
