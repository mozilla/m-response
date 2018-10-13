import auth0 from 'auth0-js'

const connection = 'Username-Password-Authentication'
const domain = process.env.REACT_APP_AUTH_DOMAIN
const clientID = process.env.REACT_APP_AUTH_CLIENT_ID
const redirectUri = window.location.origin + '/callback'
const audience = process.env.REACT_APP_AUTH_AUDIENCE

export default class Auth {
  auth = new auth0.WebAuth({
    domain,
    clientID,
    redirectUri,
    audience,
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
        domain,
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
        domain,
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
