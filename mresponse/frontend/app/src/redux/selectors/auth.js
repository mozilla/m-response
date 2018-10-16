import { getSupportedLanguages } from './config'

export const getProfile = state => {
  const { profile, extraUserMeta } = state.auth
  const meta = profile.user_metadata || {
    name: '',
    languages: '[]'
  }
  const spokenLangauges = JSON.parse(meta.languages)

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
  console.log(karma)

  return {
    name: meta.name,
    picture: profile.picture,
    email: profile.email,
    languages,
    karma
  }
}
