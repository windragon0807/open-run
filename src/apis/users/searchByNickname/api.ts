import http from '@apis/axios'

import { RequestType, ResponseType } from './type'

/**
 * 닉네임으로 사용자 검색
 */
export function searchByNickname(params: RequestType): Promise<ResponseType> {
  return http.get('/v1/users/nickname', { params })
}
