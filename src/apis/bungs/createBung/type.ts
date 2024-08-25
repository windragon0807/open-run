import { ApiResponse } from '@apis/axios'

export type RequestType = {
  name: string
  description: string
  location: string
  startDateTime: Date
  endDateTime: Date
  distance: number
  pace: string
  memberNumber: number
  hasAfterRun: boolean
  afterRunDescription: string
}

export type ResponseType = ApiResponse<{}>
