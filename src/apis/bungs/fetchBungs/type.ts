import { ApiResponse } from '@apis/axios'

export type RequestType = {
  isParticipating: boolean
  pageable: {
    page: number
    size: number
    sort: string[]
  }
}

export type ResponseType = ApiResponse<{}>
