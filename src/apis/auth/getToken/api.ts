import http from '@apis/axios'

import { RequestType, ResponseType } from './type'

/**
 * 유저 로그인 성공 시 정보 반환
 * # 헤더에 Authorization 토큰 넣어서 보내면 400 에러 뱉음
 */
export function getToken(params: RequestType): Promise<ResponseType> {
  return http.get(`/v1/users/login/${params.authServer}`, {
    params: {
      code: params.code,
      state: params.state,
    },
  })
}
