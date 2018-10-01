import axios from 'axios'

export const login = async (username, password) => {
  const data = await axios.post('/account/login', { username, password })
  if (data.token) {
    console.log(data)
  } else {
    console.alert(data.error)
  }
}
