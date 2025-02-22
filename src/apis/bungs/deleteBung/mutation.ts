import { useMutation } from 'react-query'
import http from '@apis/axios'

type RequestType = {
  bungId: string
}

function deleteBung({ bungId }: RequestType): Promise<ResponseType> {
  return http.delete(`/v1/bungs/${bungId}`)
}

export function useDeleteBung() {
  return useMutation(deleteBung)
}
