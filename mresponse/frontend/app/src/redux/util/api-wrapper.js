import Api from '@utils/api'
import { BASE_URL } from '@utils/urls'

export const connectApi = (action, ...props) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  const api = new Api(BASE_URL, token)
  return dispatch(action(api))
}
