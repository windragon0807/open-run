import { ApiResponse } from '@apis/axios'
import { Pagination } from '@apis/type'

export type RequestType = {
  page: number
  limit: number
}

export type ResponseType = Pagination &
  ApiResponse<
    Array<{
      userId: string
      nickname: string
      email: string
      runningPace: string
      runningFrequency: number
      collabCount: number
    }>
  >
