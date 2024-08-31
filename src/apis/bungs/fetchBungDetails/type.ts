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
  memberNumber: number
  hasAfterRun: boolean
  afterRunDescription: string
  isOwner: boolean
}>
