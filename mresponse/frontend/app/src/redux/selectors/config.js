export const getAppConfig = state => state.config.appConfig || {}
export const getHomeConfig = state => state.config.homeConfig || {}

export const getRespondQueue = state => getHomeConfig(state)['respond_queue'] || 0
export const getModerateQueue = state => getHomeConfig(state)['moderate_queue'] || 0

export const getFeedbackLink = state => getAppConfig(state)['feedback_url'] || '#'
export const getAboutLink = state => getAppConfig(state)['about_url'] || '#'
