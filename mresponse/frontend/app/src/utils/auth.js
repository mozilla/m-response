import auth0 from 'auth0-js'

const connection = 'Username-Password-Authentication'
const redirectUri = window.location.origin + '/callback'

const isProduction = () => window.location.host === 'respond.mozilla.community'

const stagingDomain = process.env.REACT_APP_STAGING_AUTH_DOMAIN
const productionDomain = process.env.REACT_APP_PRODUCTION_AUTH_DOMAIN
const productionClientID = process.env.REACT_APP_PRODUCTION_AUTH_CLIENT_ID
const stagingClientID = process.env.REACT_APP_STAGING_AUTH_CLIENT_ID
const productionAudience = process.env.REACT_APP_PRODUCTION_AUTH_AUDIENCE
const stagingAudience = process.env.REACT_APP_STAGING_AUTH_AUDIENCE

const getDomain = () => isProduction() ? productionDomain : stagingDomain
const getClientID = () => isProduction() ? productionClientID : stagingClientID
const getAudience = () => isProduction() ? productionAudience : stagingAudience

export default class Auth {
  auth = new auth0.WebAuth({
    domain: getDomain(),
    clientID: getClientID(),
    redirectUri,
    audience: getAudience(),
    responseType: 'token id_token',
    scope: 'openid read:current_user update:current_user_metadata',
    prompt: 'none'
  })

  login (username, password) {
    return new Promise((resolve, reject) => {
      this.auth.login({
        username,
        password,
        realm: connection
      }, (err, authResult) => {
        if (err) {
          return reject(err)
        }
        return resolve(authResult)
      })
    })
  }

  logout (returnTo) {
    this.auth.logout({
      returnTo
    })
  }

  signup (email, password, name, languages) {
    return new Promise((resolve, reject) => {
      this.auth.signup({
        email,
        password,
        user_metadata: {
          name,
          languages: JSON.stringify(languages)
        },
        connection
      }, (err, authResult) => {
        if (err) {
          return reject(err)
        }
        return resolve(authResult)
      })
    })
  }

  changePassword (email) {
    return new Promise((resolve, reject) => {
      this.auth.changePassword({
        email,
        connection
      }, (err, authResult) => {
        if (err) {
          return reject(err)
        }
        return resolve(authResult)
      })
    })
  }

  parseHash () {
    return new Promise((resolve, reject) => {
      this.auth.parseHash((err, authResult) => {
        if (err) {
          reject(err)
        }
        return resolve(authResult)
      })
    })
  }

  getUser (token, userId) {
    return new Promise((resolve, reject) => {
      const auth0Manage = new auth0.Management({
        domain: getDomain(),
        token
      })
      auth0Manage.getUser(userId, (err, authResult) => {
        if (err) {
          return reject(err)
        }
        return resolve(authResult)
      })
    })
  }

  updateUserMetadata (userId, token, metadata) {
    return new Promise((resolve, reject) => {
      const auth0Manage = new auth0.Management({
        domain: getDomain(),
        token
      })
      auth0Manage.patchUserMetadata(userId, metadata, (err, authResult) => {
        if (err) {
          console.error(err)
          return reject(err)
        }
        return resolve(authResult)
      })
    })
  }
}
