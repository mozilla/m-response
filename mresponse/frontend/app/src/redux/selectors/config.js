export const getAppConfig = state => state.config.appConfig || {}
export const getHomeConfig = state => state.config.homeConfig || {}

export const getRespondQueue = state => getHomeConfig(state)['respond_queue'] || 0
export const getModerateQueue = state => getHomeConfig(state)['moderate_queue'] || 0

export const getFeedbackUrl = state => getAppConfig(state)['feedback_url'] || '#'
export const getAboutUrl = state => getAppConfig(state)['about_url'] || '#'
export const getLegalUrl = state => getAppConfig(state)['legal_url'] || '#'
export const getPrivacyUrl = state => getAppConfig(state)['privacy_url'] || '#'
export const getCookiesUrl = state => getAppConfig(state)['cookies_url'] || '#'
export const getSupportedLanguages = state => getAppConfig(state)
  .languages
  .map(language => ({
    id: language.id,
    text: language.display_name
  })) || []
