import { ApiResponse } from '@apis/axios'

export type ResponseType = ApiResponse<{
  userId: string
  withdraw: boolean
  nickname: string
  email: string
  identityAuthenticated: boolean
  provider: string
  createdDate: any
  lastLoginDate: any
  blockchainAddress: string
  runningPace: string
  runningFrequency: number
}>
