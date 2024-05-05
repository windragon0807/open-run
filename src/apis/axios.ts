import axios, { AxiosHeaders } from 'axios'

/**
 * 공통 API Response 타입 포맷 정의
 */
export type ApiResponse<DataType> = {
  message: string
  data: DataType
}

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
})

http.interceptors.request.use((config) => {
  /* TODO Header 설정 */
  // config.headers = new AxiosHeaders()

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
