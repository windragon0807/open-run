import http from '@apis/http.client'

type RequestType = {
  bungId: string
}

export function completeBung({ bungId }: RequestType) {
  return http.patch(`/v1/bungs/${bungId}/complete`)
}
