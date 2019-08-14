import { getSupportedLanguages } from '@redux/selectors'

export * from './config'
export * from './respond'
export * from './moderate'
export * from './leaderboard'

export const getSpokenLanguages = state => {
  let languages = '[]'
  if (state.profile && state.profile.profile && state.profile.profile.languages !== '') {
    languages = state.profile.profile.languages
  }
  return JSON.parse(languages)
}

export const getProfile = state => {
  if (!state.profile.profile) {
    return null
  }

  const {
    profile: {
      profile: userProfile,
      profile: {
        can_skip_community_response_moderation: canSkipModeration
      },
      extraUserMeta: {
        karma: userKarma
      }
    }
  } = state

  const meta = userProfile || {
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

  const karma = userKarma || {
    points: 0,
    responsesCount: 0,
    moderationsCount: 0
  }

  const stats = userProfile.stats || {
    positive_in_tone_count: 0,
    positive_in_tone_change: null,
    addressing_the_issue_count: 0,
    addressing_the_issue_change: null,
    personal_count: 0,
    personal_change: null
  }

  const isMod = userProfile.is_moderator || false

  const result = {
    id: meta.username,
    name: meta.name,
    picture: meta.avatar,
    email: meta.email,
    languages,
    karma,
    stats,
    isMod,
    canSkipModeration
  }

  return result
}

export const getCannedResponses = state => (state.cannedResponses || [])
export const getHelpDocs = state => (state.helpDocs || [])
