import { BASE_URL } from '@utils/urls'
import { getSupportedLanguages } from '@redux/selectors'

export * from './config'
export * from './respond'
export * from './moderate'

export const getSpokenLanguages = state => {
  let languages = '[]'
  if (state.profile && state.profile.profile.languages !== '') {
    console.log(`getSpokenLanguages ${JSON.stringify(state.profile.profile.languages)}`)
    languages = state.profile.profile.languages
  }
  return JSON.parse(languages)
}

export const getProfile = state => {
  console.log(JSON.stringify(state.profile))

  const profile = state.profile.profile
  const extraUserMeta = state.profile.extraUserMeta
  const meta = profile || {
    name: '',
    languages: '[]',
    avatar: '',
    email: ''
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
  console.log(`Get profile meta: ${JSON.stringify(meta)}`)

  const result = {
    id: meta.username,
    name: meta.name,
    picture: `${BASE_URL}${meta.avatar}`,
    email: meta.email,
    languages: languages,
    karma
  }

  console.log(`Get profile result: ${JSON.stringify(result)}`)

  return result
}
