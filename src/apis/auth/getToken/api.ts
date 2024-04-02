import http from '@apis/axios'
import { RequestType, ResponseType } from './type'

/**
 * 유저 로그인 성공 시 정보 반환
 * http://52.79.203.144:8080/swagger-ui/index.html#/user-controller/getUser
 */
export default function getToken(params: RequestType) {
  return http.get(`v1/users/login/${params.authServer}`, {
    params: {
      code: params.code,
      state: params.state,
    },
  })
}
