import http from '@apis/axios'

export type RequestType = {
  code: string
}

export type ResponseType = {
  email: string
  nickname: string | null
  jwtToken: string
}

/**
 * 스마트 월렛 로그인
 */
export async function smartWalletLogin(params: RequestType) {
  return http.get<ResponseType>('/v1/users/login/smart_wallet', { params })
} 