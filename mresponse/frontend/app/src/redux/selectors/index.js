import { BASE_URL } from '@utils/urls'
import { getSupportedLanguages } from '@redux/selectors'

export * from './config'
export * from './respond'
export * from './moderate'

export const getSpokenLanguages = state => {
  let languages = '[]'
  if (state.profile && state.profile.profile && state.profile.profile.languages !== '') {
    languages = state.profile.profile.languages
  }
  return JSON.parse(languages)
}

export const getProfile = state => {
  const profile = state.profile.profile
  const extraUserMeta = state.profile.extraUserMeta
  const meta = profile || {
    name: '',
    languages: '[]',
    avatar: '',
    email: ''
  }
  const spokenLanguages = getSpokenLanguages(state)
  const languages = getSupportedLanguages(state)
    .filter(language => {
      return spokenLanguages.some(code => {
        return (code === language.id)
      })
    })

  const karma = extraUserMeta.karma || {
    points: 0,
    responsesCount: 0,
    moderationsCount: 0
  }

  const result = {
    id: meta.username,
    name: meta.name,
    picture: `${BASE_URL}${meta.avatar}`,
    email: meta.email,
    languages: languages,
    karma
  }

  return result
}
