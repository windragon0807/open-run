import { useMutation } from '@tanstack/react-query'
import http from '@apis/axios'

export type RequestType = {
  name: string
  description: string
  location: string
  latitude: number
  longitude: number
  startDateTime: string
  endDateTime: string
  distance: number
  pace: string
  memberNumber: number
  hasAfterRun: boolean
  afterRunDescription: string
  hashtags: string[]
  mainImage: string
}

function createBung(params: RequestType) {
  return http.post('/v1/bungs', params)
}

export function useCreateBung() {
  return useMutation({
    mutationFn: createBung,
  })
}
