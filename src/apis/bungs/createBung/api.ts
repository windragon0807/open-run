import http from '@apis/axios'

import { RequestType, ResponseType } from './type'

/**
 * 벙 생성
 */
export function createBung(params: RequestType): Promise<ResponseType> {
  return http.post('/v1/bungs', params)
}
