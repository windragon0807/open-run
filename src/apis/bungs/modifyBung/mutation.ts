import http from '@apis/axios'
import { useMutation } from 'react-query'

type RequestType = {
  bungId: string
  name: string
  description: string
  memberNumber: number
  hasAfterRun: boolean
  afterRunDescription: string
  hashtags: string[]
}

export function modifyBung({ bungId, ...rest }: RequestType) {
  return http.patch(`/v1/bungs/${bungId}`, rest)
}

export function useModifyBung() {
  return useMutation(modifyBung)
}
