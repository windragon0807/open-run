import { ApiResponse } from '@apis/axios'
import { Pagination } from '@apis/type'

export type RequestType = {
  /* null : 전체, true : 내가 벙주인 벙, false : 내가 참여한 벙 */
  isOwned: boolean | null
  /* null : 현재 일자보다 미래 시점의 모든 벙, PARTICIPATING : 시작은 했는데 안 끝난 벙, ACCOMPLISHED : 완료된 벙 */
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
      startDateTime: string // "2025-01-31 00:00:00"
      endDateTime: string
      distance: number
      pace: string
      memberNumber: number
      hasAfterRun: boolean
      afterRunDescription: string
      isCompleted: boolean
      hastags: string[]
      hasOwnership: boolean
    }>
  >
