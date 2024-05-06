import axios, { AxiosError, AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios'

import { COOKIE } from '@constants/cookie'

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

http.interceptors.request.use(async (config) => {
  /* LOGGING */
  const { method, url } = config
  if (process.env.NODE_ENV === 'development') {
    console.log(`🚀 [API] ${method?.toUpperCase()} ${url} | Request`)
  }

  /* HEADER CONFIG */
  let token
  if (typeof window === 'undefined') {
    /* At Server Component */
    const { cookies } = await import('next/headers')
    token = cookies().get(COOKIE.ACCESSTOKEN)?.value
  } else {
    /* At Client Component */
    const { getCookie } = await import('@utils/cookie')
    token = getCookie(COOKIE.ACCESSTOKEN)
  }

  /* 쿠키에 토큰 값이 있으면 헤더에 토큰을 넣어서 보냄 */
  if (token != null) {
    config.headers = new AxiosHeaders()
    config.headers['Authorization'] = token
  }

  return config
})

http.interceptors.response.use(
  /* 응답 성공 시 */
  (response: AxiosResponse) => {
    /* LOGGING */
    const { method, url } = response.config
    const { status } = response
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 [API] ${method?.toUpperCase()} ${url} | Response ${status}`)
    }

    return response.data
  },

  /* 응답 실패 시 */
  (error: AxiosError | Error) => {
    if (axios.isAxiosError(error)) {
      /* LOGGING */
      const { message } = error
      const { method, url } = error.config as AxiosRequestConfig
      const { status, statusText } = error.response as AxiosResponse
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚨 [API] ${method?.toUpperCase()} ${url} | Error ${status} ${statusText} | ${message}`)
      }
    }

    return Promise.reject(error)
  },
)

export default http
