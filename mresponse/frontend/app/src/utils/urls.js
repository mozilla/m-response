// Config
export const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://mresponse.local:8000'

// React App Routes
export const WELCOME_URL = '/'
export const LOGIN_URL = '/account/login'
export const SIGNUP_URL = '/account/signup'
export const FORGOT_PASSWORD_URL = '/account/forgot'
export const LOGOUT_URL = '/logout'
export const CALLBACK_URL = '/callback'
export const DASHBOARD_URL = '/dashboard'
export const PROFILE_URL = '/profile'
export const RESPOND_URL = '/respond'

// Helper Functions
export const staticAsset = url => `/static/${url}`
