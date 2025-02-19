import { useMutation } from 'react-query'
import http from '@apis/axios'

export type RequestType = {
  bungId: string
}

function certifyParticipation({ bungId }: RequestType) {
  return http.post(`/v1/bungs/${bungId}/participated`)
}

export function useCertifyParticipation() {
  return useMutation(certifyParticipation)
}
