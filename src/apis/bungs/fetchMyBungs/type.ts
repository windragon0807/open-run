import { ApiResponse } from '@apis/axios'
import { Pagination } from '@apis/type'

export type RequestType = {
  /* null : 전체, true : 내가 벙주인 벙, false : 내가 참여한 벙 */
  isOwned: boolean | null
  /* null : 전부, PARTICIPATING : 아직 시작하지 않은, ACCOMPLISHED : 완료된 */
  status: 'PARTICIPATING' | 'ACCOMPLISHED' | null
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
      startDateTime: string // 2024-11-27T07:47:20.196Z
      endDateTime: string
      distance: number
      pace: string
      memberNumber: number
      hasAfterRun: boolean
      afterRunDescription: string
    }>
  >
