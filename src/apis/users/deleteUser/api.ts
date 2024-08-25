import http from '@apis/axios'

/**
 * 설문조사 결과 저장
 * https://open-run.xyz/swagger-ui/index.html#/user-controller/deleteUserInfo
 */
export function deleteUser() {
  return http.delete('/v1/users')
}
