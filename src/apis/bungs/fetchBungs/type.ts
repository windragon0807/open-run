import { ApiResponse } from '@apis/axios'
import { Pagination } from '@apis/type'

export type RequestType = {
  /**
   * true : 참가할 수 있는 벙만 보여집니다.
   * false : 이미 참가한 벙도 보여집니다.
   */
  isAvailableOnly: boolean
  page: number
  limit: number
}

export type ResponseType = Pagination &
  ApiResponse<
    Array<{
      bungId: string
      name: string
      description: string
      location: string
      startDateTime: string
      endDateTime: string
      distance: number
      pace: string
      memberNumber: number
      hasAfterRun: boolean
      afterRunDescription: string
      hashtags: string[]
    }>
  >
