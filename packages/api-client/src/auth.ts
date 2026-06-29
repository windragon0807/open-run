import http from './browser'
import type { ApiResponse } from './type'

export { logoutSession } from './browser'

export type SmartWalletLoginNonceRequest = {
  blockchainAddress: string
}

export type SmartWalletLoginNonceResponse = ApiResponse<{
  nonce: string
  message: string
}>

export type SmartWalletLoginRequest = {
  code: string
  nonce: string
  state: string
}

export type SmartWalletMessageSigner = (message: string) => Promise<string>

export type SmartWalletLoginResponse = ApiResponse<{
  email: string
  identifier: string
  nickname: string | null
  jwtToken: string
}>

export function createSmartWalletLoginNonce(
  request: SmartWalletLoginNonceRequest,
): Promise<SmartWalletLoginNonceResponse> {
  return http.post('/v1/auth/login-nonce', request, { skipAuthRefresh: true })
}

export function smartWalletLogin(params: SmartWalletLoginRequest): Promise<SmartWalletLoginResponse> {
  return http.post('/v1/users/login/smart_wallet', params, {
    credentials: 'include',
    skipAuthRefresh: true,
  })
}

export async function createSignedSmartWalletLoginRequest(
  blockchainAddress: string,
  signMessage: SmartWalletMessageSigner,
): Promise<SmartWalletLoginRequest> {
  const { data } = await createSmartWalletLoginNonce({ blockchainAddress })
  const signature = await signMessage(data.message)

  return {
    code: blockchainAddress,
    nonce: data.nonce,
    state: signature,
  }
}
