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

  const stats = {
    // thisWeek: {
    //   tone: 3 || 0,
    //   issue: 3 || 0,
    //   personal: 3 || 0,
    //   total: 4 || 0
    // },
    thisWeek: {
      tone: userProfile.stats.positive_in_tone_count || 0,
      issue: userProfile.stats.addressing_the_issue_count || 0,
      personal: userProfile.stats.personal_count || 0,
      total: userProfile.stats.current_count || 0
    },
    // progress: {
    //   tone: 2.0 || 0,
    //   issue: null || 0,
    //   personal: 2.0 || 0,
    //   total: 1 || 0
    // }
    progress: {
      tone: userProfile.stats.positive_in_tone_change || 0,
      issue: userProfile.stats.addressing_the_issue_change || 0,
      personal: userProfile.stats.personal_change || 0,
      total: userProfile.stats.previous_count || 0
    }
  }

  const isMod = userProfile.can_skip_community_response_moderation || false
  const isSuperMod = userProfile.is_super_moderator || false

  const result = {
    id: meta.username,
    name: meta.name,
    picture: meta.avatar,
    email: meta.email,
    languages,
    karma,
    stats,
    isMod,
    isSuperMod,
    canSkipModeration
  }

  return result
}

export const getCannedResponses = state => (state.cannedResponses || [])
export const getHelpDocs = state => (state.helpDocs || [])
