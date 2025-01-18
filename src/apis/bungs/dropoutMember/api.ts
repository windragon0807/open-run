import http from '@apis/axios'
import { RequestType } from './type'

/**
 * 멤버 삭제하기 (벙주와 본인만 가능)
 */
export function dropoutMember({ bungId, userId }: RequestType): Promise<ResponseType> {
  return http.delete(`/v1/bungs/${bungId}/members/${userId}`)
}
