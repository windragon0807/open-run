import http from '@apis/axios'

import { RequestType, ResponseType } from './type'

/**
 * 벙 정보 상세보기
 */
export function fetchBungDetail({ bungId }: RequestType): Promise<ResponseType> {
  return http.get(`/v1/bungs/${bungId}`)
}
