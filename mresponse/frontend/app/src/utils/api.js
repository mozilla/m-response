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
        },
        stats: { ...json.profile.stats }
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

  async getResponse (languages, pageNum) {
    let params = '?'
    if (languages && languages.length) {
      params = params + this.generateLanguageParam(languages)
    }

    if (pageNum) params = params ? params + `;page=${pageNum}` : params + `page=${pageNum}`

    const response = await this.fetch(`/api/response/${params}`)
    if (response.status === 200) {
      return response.json().then(json => {
        // Prev + next page numbers
        const next = new URLSearchParams(json.next).get('page') || 0
        const previous = json.previous === null ? 0 : new URLSearchParams(json.previous).get('page') || 1
        const currPage = previous >= 1 ? Number(previous) + 1 : 1

        // Get pages array
        const displayPerPage = 4 // Set by API
        const pagesCount = Math.ceil(json.count / displayPerPage)

        let start = 0
        let end = 0
        const pagesCutOff = 15
        const ceiling = Math.ceil(pagesCutOff / 2)
        const floor = Math.floor(pagesCutOff / 2)

        // Calc range of page nums
        if (pagesCount < pagesCutOff) {
          start = 0
          end = pagesCount
        } else if (currPage >= 1 && currPage <= ceiling) {
          start = 0
          end = pagesCutOff
        } else if ((currPage + floor) >= pagesCount) {
          start = (pagesCount - pagesCutOff)
          end = pagesCount
        } else {
          start = (currPage - ceiling)
          end = (currPage + floor)
        }

        // Assemble page numbers based on range
        const pages = []
        for (let i = start; i < end; i++) {
          pages.push(i + 1)
        }

        return {
          count: json.count,
          pagesCount,
          next,
          previous,
          pages,
          currPage,
          results: json.results.map(result => (
            {
              id: result.id,
              text: result.text,
              review: this.serializeReview(result.review),
              moderationUrl: result.moderation_url,
              submittedAt: new Date(result.submitted_at),
              moderationCount: result.moderation_count
            }
          ))
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
    return { detail: 'Thank you for your effort and making Mozilla better for all of us!' }
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

    const resPayload = await response.json()

    if (!response.ok) {
      const errorMessage = { detail: 'Unable to submit moderation' }
      if (Array.isArray(resPayload) && resPayload.length > 0) errorMessage.detail = resPayload[0]
      if (resPayload.feedback_message) errorMessage.detail = resPayload.feedback_message

      throw errorMessage
    }

    return { detail: 'Thank you for your effort and making Mozilla better for all of us!' }
  }

  async editResponse (responseId, editedRespText) {
    let response = await this.fetch(`/api/response/${responseId}/`, {
      method: 'PUT',
      body: JSON.stringify({
        text: editedRespText
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookie.get('csrftoken')
      }
    })

    if (!response.ok) {
      const errorMessage = { detail: 'Unable to edit response text' }
      throw errorMessage
    }

    return { detail: 'Response was edited' }
  }

  async submitApproval (responseId) {
    let response = await this.fetch(`/api/moderation/approve/${responseId}/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': Cookie.get('csrftoken')
      }
    })

    if (!response.ok) {
      const errorMessage = { detail: 'Unable to approve the response' }
      throw errorMessage
    }

    return { detail: 'Thank you for your effort and making Mozilla better for all of us!' }
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
    let response = await this.fetch(`/api/response/skip/${responseId}/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': Cookie.get('csrftoken')
      }
    })

    if (!response.ok) {
      const errorMessage = { detail: 'Unable to skip' }
      throw errorMessage
    }

    return response
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

  async getLeaderboard () {
    const res = await this.fetch(`/api/leaderboard/`)
    if (res.ok) {
      return res.json().then(json => {
        return json.records
      })
    }
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

  async getCannedResponses () {
    const res = await this.fetch(`/api/canned_response/`)
    return res.json().then(json => (json))
  }

  async getHelpDocs () {
    const res = await this.fetch(`/api/documentation/`)
    return res.json().then(json => (json))
    // return res.json().then(json => {
    //   console.log('API helpDocs: ', json)
    //   return json
    // })
  }
}
