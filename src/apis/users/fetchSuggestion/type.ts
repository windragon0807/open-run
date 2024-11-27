import { ApiResponse } from '@apis/axios'

export type RequestType = {
  page: number
  limit: number
}

export type ResponseType = ApiResponse<
  Array<{
    userId: string
    nickname: string
    email: string
    runningPace: string
    runningFrequency: number
    collabCount: number
  }>
> & {
  totalPages: number
  totalElements: number
  first: boolean
  last: boolean
  empty: boolean
}
