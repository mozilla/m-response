export const appConfig = state => state.config.appConfig
export const homeConfig = state => state.config.homeConfig

export const respondQueue = state => homeConfig(state)['respond_queue'] || 0
export const moderateQueue = state => homeConfig(state)['moderate_queue'] || 0

export const feedbackLink = state => appConfig(state)['feedback_url'] || '#'
export const aboutLink = state => appConfig(state)['about_url'] || '#'