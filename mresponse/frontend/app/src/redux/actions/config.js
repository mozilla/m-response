import { connectApi } from '@redux/util/api-wrapper'

export const UPDATE_APP_CONFIG = 'UPDATE_APP_CONFIG'
export const UPDATE_HOME_CONFIG = 'UPDATE_HOME_CONFIG'

export const updateAppConfig = () => connectApi(api => async (dispatch, getState) => {
  try {
    return dispatch({
      type: UPDATE_APP_CONFIG,
      appConfig: await api.getConfig()
    })
  } catch (e) {
    console.error(e)
  }
})

export const updateHomeConfig = () => connectApi(api => async (dispatch, getState) => {
  try {
    return dispatch({
      type: UPDATE_HOME_CONFIG,
      homeConfig: await api.getHomeConfig()
    })
  } catch (e) {
    console.error(e)
  }
})
