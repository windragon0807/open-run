import http from '@apis/axios'

import { RequestType, ResponseType } from './type'

/**
 * 자주 함께한 사용자 목록
 */
export function fetchSuggestion(params: RequestType): Promise<ResponseType> {
  return http.get('/v1/users/suggestion', { params })
}
