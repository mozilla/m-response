import { connectApi } from '@redux/util/api-wrapper'

export * from './config'
export * from './respond'
export * from './moderate'
export * from './leaderboard'

// TODO fix missing function implementations
export const SET_PROFILE = 'SET_PROFILE'
export const LOGOUT = 'LOGOUT'
export const UPDATE_EXTRA_USER_META = 'UPDATE_EXTRA_USER_META'
export const SET_CANNED_RESONSES = 'SET_CANNED_RESONSES'
export const SET_HELP_DOCS = 'SET_HELP_DOCS'

export const updateExtraUserMeta = meta => ({
  type: UPDATE_EXTRA_USER_META,
  meta
})

export const fetchExtraUserMeta = () => connectApi(api =>
  async (dispatch) => {
    try {
      const meta = await api.getExtraUserMeta()
      return dispatch(updateExtraUserMeta(meta))
    } catch (err) {
      console.error(err)
    }
  }
)

export const fetchProfile = () => connectApi(api =>
  async (dispatch) => {
    try {
      const profile = await api.getProfile()
      // console.log(`Dispatch fetchProfile: ${JSON.stringify(profile)}`)
      return dispatch({
        type: SET_PROFILE,
        profile: profile,
        languages: profile.languages
      })
    } catch (err) {
      console.error(err)
    }
  }
)

export const updateProfile = ({ name, languages }) => connectApi(api => async (dispatch, getState) => {
  try {
    const metadata = {}
    if (name) {
      metadata.name = name
    }
    if (languages) {
      metadata.languages = JSON.stringify(languages)
    }
    if (metadata.name || metadata.languages) {
      console.log(metadata)
      const updatedProfile = await api.updateProfile(metadata)
      return dispatch({
        type: SET_PROFILE,
        profile: updatedProfile
      })
    }
  } catch (err) {
    console.error(err)
  }
})

export const uploadAvatar = file => connectApi(api =>
  async (dispatch, getState) => {
    try {
      const picture = await api.uploadAvatar(file)
      console.log(`UploadAvatar picture: ${picture}`)
      const updatedProfile = await api.getProfile()
      return dispatch({
        type: SET_PROFILE,
        profile: updatedProfile
      })
    } catch (e) {
      console.error(e)
    }
  }
)

export const logout = () => dispatch => {
  return dispatch({
    type: LOGOUT
  })
}

export const fetchCannedResponses = () => connectApi(api =>
  async (dispatch) => {
    try {
      const cannedResponses = await api.getCannedResponses()
      return dispatch({
        type: SET_CANNED_RESONSES,
        cannedResponses
      })
    } catch (err) {
      console.error(err)
    }
  }
)

export const fetchHelpDocs = () => connectApi(api =>
  async (dispatch) => {
    try {
      const helpDocs = await api.getHelpDocs()
      // console.log('Actions: ', helpDocs)
      return dispatch({
        type: SET_HELP_DOCS,
        helpDocs
      })
    } catch (err) {
      console.error(err)
    }
  }
)
