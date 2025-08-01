import { useMutation } from '@tanstack/react-query'
import http from '@apis/axios'

export type RequestType = {
  bungId: string
}

function certifyParticipation({ bungId }: RequestType) {
  return http.patch(`/v1/bungs/${bungId}/participated`)
}

export function useCertifyParticipation() {
  return useMutation({
    mutationFn: certifyParticipation,
  })
}
