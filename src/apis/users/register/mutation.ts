import { useMutation } from 'react-query'
import http from '@apis/axios'
import { UserRegister } from '@type/register'

type RequestType = UserRegister

/**
 * 설문조사 결과 저장
 * https://open-run.xyz/swagger-ui/index.html#/user-controller/saveSurveyResult
 */
function register(params: RequestType) {
  return http.patch('/v1/users', params)
}

export function useRegister() {
  return useMutation(register)
}
