import auth0 from 'auth0-js'

const connection = 'Username-Password-Authentication'
const domain = process.env.REACT_APP_AUTH_DOMAIN
const clientID = process.env.REACT_APP_AUTH_CLIENT_ID
const redirectUri = process.env.REACT_APP_AUTH_CALLBACK_URL

export default class Auth {
  auth = new auth0.WebAuth({
    domain,
    clientID,
    redirectUri,
    responseType: 'token id_token',
    scope: 'openid profile read:current_user',
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

  logout (redirectTo) {
    this.auth.logout({
      redirectTo
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
}
