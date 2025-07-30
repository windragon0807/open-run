import { useMutation } from '@tanstack/react-query'
import http from '@apis/axios'

type RequestType = {
  bungId: string
  userId: string
}

function dropoutMember({ bungId, userId }: RequestType): Promise<ResponseType> {
  return http.delete(`/v1/bungs/${bungId}/members/${userId}`)
}

export function useDropoutMember() {
  return useMutation({
    mutationFn: dropoutMember,
  })
}
