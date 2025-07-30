import { useMutation } from '@tanstack/react-query'
import http from '@apis/axios'

type RequestType = {
  bungId: string
  name: string
  description: string
  memberNumber: number
  hasAfterRun: boolean
  afterRunDescription: string
  hashtags: string[]
}

function modifyBung({ bungId, ...rest }: RequestType) {
  return http.patch(`/v1/bungs/${bungId}`, rest)
}

export function useModifyBung() {
  return useMutation({
    mutationFn: modifyBung,
  })
}
