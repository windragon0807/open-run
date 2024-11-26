import { ApiResponse } from '@apis/axios'

export type RequestType = {
  bungId: string
}

export type ResponseType = ApiResponse<{
  bungId: string
  name: string
  description: string
  location: string
  startDateTime: string
  endDateTime: string
  distance: number
  pace: string
  memberNumber: number // 총 참여자 수
  hasAfterRun: boolean
  afterRunDescription: string
  hashtags: string[]
  memberList: Array<{
    userId: string
    nickname: string
    email: string
    userBungId: number
    participationStatus: boolean
    owner: boolean
  }>
}>
