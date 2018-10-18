import Api from '@utils/api'

export const connectApi = (action, ...props) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  const api = new Api(token)
  return dispatch(action(api))
}
