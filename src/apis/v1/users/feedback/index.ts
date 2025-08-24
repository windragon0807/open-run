import http from '@apis/axios'

type RequestType = {
  targetUserIds: string[]
}

export function sendMemberLike(params: RequestType) {
  return http.patch('/v1/users/feedback', params)
}
