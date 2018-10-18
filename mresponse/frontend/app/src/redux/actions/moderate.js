import { connectApi } from '@redux/util/api-wrapper'

export const UPDATE_MOD_RESPONSE = 'UPDATE_MOD_RESPONSE'
export const UPDATE_MODERATION = 'UPDATE_MODERATION'

export const fetchNextResponse = () => connectApi(api => async (dispatch, getState) => {
  try {
    const response = await api.getResponse()
    return dispatch({
      type: UPDATE_MOD_RESPONSE,
      response
    })
  } catch (e) {
    return dispatch({
      type: UPDATE_MOD_RESPONSE,
      response: null
    })
  }
})

export const updateCurrentModeration = moderation => ({
  type: UPDATE_MODERATION,
  moderation
})

export const submitModeration = cb => connectApi(api => async (dispatch, getState) => {
  const { moderate: { currentResponse, currentResponseModeration } } = getState()
  try {
    if (currentResponse) {
      const res = await api.submitModeration(currentResponse.id, currentResponseModeration)
      cb(res.detail, null)
      return dispatch(fetchNextResponse())
    }
  } catch (e) {
    cb(null, e)
  }
})
