import { useMutation } from '@tanstack/react-query'
import { UserRegister } from '@type/register'
import http from '@apis/axios'

type RequestType = UserRegister

/**
 * 설문조사 결과 저장
 * https://open-run.xyz/swagger-ui/index.html#/user-controller/saveSurveyResult
 */
function register(params: RequestType) {
  return http.patch('/v1/users', params)
}

export function useRegister() {
  return useMutation({
    mutationFn: register,
  })
}
