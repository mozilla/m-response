import Api from '@utils/api'
import { BASE_URL } from '@utils/urls'

export const connectApi = (action, ...props) => (dispatch, getState) => {
  const api = new Api(BASE_URL)
  return dispatch(action(api))
}
