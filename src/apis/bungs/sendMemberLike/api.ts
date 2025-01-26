import http from '@apis/axios'
import { RequestType } from './type'

export function sendMemberLike(params: RequestType) {
  return http.get('/v1/users/feedback', { params })
}
