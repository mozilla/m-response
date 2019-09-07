import { connectApi } from '@redux/util/api-wrapper'
import { getSpokenLanguages } from '@redux/selectors'

export const UPDATE_MOD_RESPONSE = 'UPDATE_MOD_RESPONSE'
export const UPDATE_MODERATION = 'UPDATE_MODERATION'

export const fetchResponses = (cb = () => null, pageNum = null) =>
  connectApi(api =>
    async (dispatch, getState) => {
      const languages = getSpokenLanguages(getState())
      try {
        const response = await api.getResponse(languages, pageNum)
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

export const submitModeration = (cb = () => null, currResponsId) =>
  connectApi(api =>
    async (dispatch, getState) => {
      const { moderate: { currentResponseModeration } } = getState()
      console.log('submitModeration test', currentResponseModeration)
      if (currResponsId) {
        try {
          const res = await api.submitModeration(currResponsId, currentResponseModeration)
          cb(res.detail, null)
          return dispatch(fetchResponses())
        } catch (e) {
          console.log('testing!!!', e)
          cb(e.detail, true)
        }
      }
    }
  )

export const submitApproval = (cb = () => null) =>
  connectApi(api =>
    async (dispatch, getState) => {
      const { moderate: { currentResponse } } = getState()
      if (currentResponse) {
        try {
          const res = await api.submitApproval(currentResponse.id)
          cb(res.detail, null)
          return dispatch(fetchResponses())
        } catch (e) {
          cb(e.detail, true)
        }
      }
    }
  )

export const skipResponse = (cb = () => null) =>
  connectApi(api =>
    async (dispatch, getState) => {
      const { moderate: { currentResponse } } = getState()
      if (currentResponse) {
        try {
          await api.skipResponse(currentResponse.id)
          return dispatch(fetchResponses())
        } catch (e) {
          cb(e.detail, true)
        }
      }
    }
  )
