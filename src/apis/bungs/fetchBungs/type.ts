import { ApiResponse } from '@apis/axios'

export type RequestType = {
  status: 'ALL' | 'AVAILABLE' | 'PENDING' | 'ACHIEVED'
  page: number
  limit: number
}

export type ResponseType = ApiResponse<
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
    isOwner: boolean
  }>
> & {
  totalPages: number
  totalElements: number
  first: boolean
  last: boolean
  empty: boolean
}
