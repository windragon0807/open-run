import http from '@apis/axios'

import { RequestType, ResponseType } from './type'

/**
 * 내가 참여하고 있는 벙 리스트 조회하기
 */
export function fetchMyBungs(params: RequestType): Promise<ResponseType> {
  return http.get('/v1/bungs/my-bungs', { params })
}
