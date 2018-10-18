// App
export const BASE_URL = process.env.REACT_APP_BASE_URL || ''

// React App Routes
export const WELCOME_URL = '/'
export const LOGIN_URL = '/account/login/'
export const SIGNUP_URL = '/account/signup/'
export const FORGOT_PASSWORD_URL = '/account/forgot/'
export const LOGOUT_URL = '/logout/'
export const CALLBACK_URL = '/callback/'
export const DASHBOARD_URL = '/dashboard/'
export const PROFILE_URL = '/profile/'
export const SETTINGS_URL = '/profile/edit/'
export const RESPOND_URL = '/respond/'
export const MODERATE_URL = '/moderate/'

// Helper Functions
export const staticAsset = url => `/static/${url}`
