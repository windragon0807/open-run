import http from '@apis/http.client'

type RequestType = {
  bungId: string
  targetUserIds: string[]
}

export function sendMemberLike(params: RequestType) {
  return http.patch('/v1/users/feedback', params)
}
