import http from '@apis/http.client'

type RequestType = {
  bungId: string
  userId: string
}

export function dropoutMember({ bungId, userId }: RequestType): Promise<ResponseType> {
  return http.delete(`/v1/bungs/${bungId}/members/${userId}`)
}
