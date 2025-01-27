import http from '@apis/axios'

import { RequestType, ResponseType } from './type'

export const baseUrl = '/v1/bungs/my-bungs'
/**
 * 내가 참여하고 있는 벙 리스트 조회하기
 */
export function fetchMyBungs(params: RequestType): Promise<ResponseType> {
  return http.get(baseUrl, { params })
}
