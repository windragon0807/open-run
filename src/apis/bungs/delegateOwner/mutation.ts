import { useMutation } from '@tanstack/react-query'
import http from '@apis/axios'

type RequestType = {
  bungId: string
  newOwnerUserId: string
}

function delegateOwner({ bungId, newOwnerUserId }: RequestType): Promise<ResponseType> {
  return http.patch(`/v1/bungs/${bungId}/change-owner?newOwnerUserId=${newOwnerUserId}`)
}

export function useDelegateOwner() {
  return useMutation({
    mutationFn: delegateOwner,
  })
}
