import http from '@apis/axios'
import { RequestType } from './type'

/**
 * 벙 변경 (벙주만 가능)
 */
export function delegateOwner({ bungId, newOwnerUserId }: RequestType): Promise<ResponseType> {
  return http.patch(`/v1/bungs/${bungId}/change-owner?newOwnerUserId=${newOwnerUserId}`)
}
