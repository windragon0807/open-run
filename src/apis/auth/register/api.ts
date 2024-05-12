import http from '@apis/axios'

import { RequestType, ResponseType } from './type'

/**
 * 설문조사 결과 저장
 * https://open-run.xyz/swagger-ui/index.html#/user-controller/saveSurveyResult
 */
export function register(params: RequestType): Promise<ResponseType> {
  return http.patch('/v1/users', params)
}
