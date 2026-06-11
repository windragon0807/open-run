import http from '@apis/http.client'

type RequestType = {
  bungId: string
}

export function joinBung({ bungId }: RequestType) {
  return http.get(`/v1/bungs/${bungId}/join`)
}
