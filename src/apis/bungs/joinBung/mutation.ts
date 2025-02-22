import { useMutation } from 'react-query'
import http from '@apis/axios'

type RequestType = {
  bungId: string
}

function joinBung({ bungId }: RequestType) {
  return http.get(`/v1/bungs/${bungId}/join`)
}

export function useJoinBung() {
  return useMutation(joinBung)
}
