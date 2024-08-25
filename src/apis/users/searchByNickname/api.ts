import http from '@apis/axios'

import { RequestType, ResponseType } from './type'

/**
 * 닉네임을 통한 검색
 */
export function searchByNickname({ nickname }: RequestType): Promise<ResponseType> {
  return http.get(`/v1/users/${nickname}`)
}
