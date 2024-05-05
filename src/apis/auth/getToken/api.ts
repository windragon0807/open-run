import http from '@apis/axios'
import { RequestType, ResponseType } from './type'

/**
 * 유저 로그인 성공 시 정보 반환
 * TODO Swagger URL 추가
 */
export default function getToken(params: RequestType): Promise<ResponseType> {
  return http.get(`/v1/users/login/${params.authServer}`, {
    params: {
      code: params.code,
      state: params.state,
    },
  })
}
