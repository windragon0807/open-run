import axios, { AxiosHeaders } from 'axios'

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
})

http.interceptors.request.use((config) => {
  /* TODO Header 설정 */
  // config.headers = new AxiosHeaders()
  // config.headers['openrun-jwt'] = 'sample-jwt'

  return config
})

http.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    return Promise.reject(err)
  },
)

export default http
