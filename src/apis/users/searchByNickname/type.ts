import { ApiResponse } from '@apis/axios'

export type RequestType = {
  nickname: string
}

export type ResponseType = ApiResponse<
  Array<{
    userId: string
    nickname: string
    email: string
    identityAuthenticated: boolean
    provider: 'kakao' | 'naver'
    blackListed: boolean
    createdDate: string // 2024-11-27T06:39:53.326Z
    lastLoginDate: string // 2024-11-27T06:39:53.326Z
    blockchainAddress: string
    runningPace: string
    runningFrequency: number
  }>
>
