import { BASE_URL } from '@utils/urls'
import { getSupportedLanguages } from './config'

export const getSpokenLanguages = state => {
  return JSON.parse(state.auth.profile.user_metadata.languages)
}

export const getProfile = state => {
  const { profile, extraUserMeta } = state.auth
  const meta = profile.user_metadata || {
    name: '',
    languages: '[]'
  }
  const spokenLangauges = getSpokenLanguages(state)

  const languages = getSupportedLanguages(state)
    .filter(language => {
      let speaksLanguage = false
      spokenLangauges.map(code => {
        if (code === language.id) {
          speaksLanguage = true
        }
        return code
      })
      return speaksLanguage
    })

  const karma = extraUserMeta.karma || {
    points: 0,
    responsesCount: 0,
    moderationsCount: 0
  }

  return {
    id: profile.user_id,
    name: meta.name,
    picture: `${BASE_URL}${meta.picture}` || profile.picture,
    email: profile.email,
    languages,
    karma
  }
}
