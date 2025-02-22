import { useMutation } from 'react-query'
import http from '@apis/axios'

type RequestType = {
  bungId: string
}

function completeBung({ bungId }: RequestType) {
  return http.patch(`/v1/bungs/${bungId}/complete`)
}

export function useCompleteBung() {
  return useMutation(completeBung)
}
