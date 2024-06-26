import http from '@apis/axios'
import { RequestType, ResponseType } from '@apis/auth/checkExistNickname/type'

/**
 * 해당 닉네임이 중복된 닉네임인지 확인하는 API
 */
export default function checkExistNickname(params: RequestType): Promise<ResponseType> {
  return http.get('/v1/users/nickname/exist', {
    params: {
      nickname: params.nickname,
    },
  })
}
