import http from '@apis/axios'

import { ResponseType } from './type'

/**
 * NFT Minting
 */
export function minting(): Promise<ResponseType> {
  return http.post('/v1/xrpls')
}
