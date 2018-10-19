import { connectApi } from '@redux/util/api-wrapper'
import { getSpokenLanguages } from '@redux/selectors'

export const UPDATE_MOD_RESPONSE = 'UPDATE_MOD_RESPONSE'
export const UPDATE_MODERATION = 'UPDATE_MODERATION'

export const fetchNextResponse = (cb = () => null) =>
  connectApi(api =>
    async (dispatch, getState) => {
      const languages = getSpokenLanguages(getState())
      try {
        const response = await api.getResponse(languages)
        cb(null, null)
        return dispatch({
          type: UPDATE_MOD_RESPONSE,
          response
        })
      } catch (e) {
        cb(null, e)
        return dispatch({
          type: UPDATE_MOD_RESPONSE,
          response: null
        })
      }
    }
  )

export const updateCurrentModeration = moderation => ({
  type: UPDATE_MODERATION,
  moderation
})

export const submitModeration = (cb = () => null) =>
  connectApi(api =>
    async (dispatch, getState) => {
      const { moderate: { currentResponse, currentResponseModeration } } = getState()
      try {
        if (currentResponse) {
          const res = await api.submitModeration(currentResponse.id, currentResponseModeration)
          cb(res.detail, null)
          return dispatch(fetchNextResponse(cb))
        }
      } catch (e) {
        cb(null, e)
      }
    }
  } catch (e) {
    cb(null, e)
  }
})

export const skipModeration = (cb = () => null) => connectApi(api => async (dispatch, getState) => {
  const { moderate: { currentResponse } } = getState()
  try {
    await api.skipModeration(currentResponse.id)
    return dispatch(fetchNextResponse(cb))
  } catch (e) {
    console.error(e)
  }
})
