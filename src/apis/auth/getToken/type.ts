import { ApiResponse } from '@apis/axios'

export type RequestType = {
  authServer: 'kakao' | 'naver'
  code: string
  state?: string
}

export type ResponseType = ApiResponse<{
  email: string
  nickname: string | null
  jwtToken: string
}>
