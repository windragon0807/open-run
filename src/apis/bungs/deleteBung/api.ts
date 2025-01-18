import http from '@apis/axios'
import { RequestType } from './type'

/**
 * 벙 삭제하기
 */
export function deleteBung({ bungId }: RequestType): Promise<ResponseType> {
  return http.delete(`/v1/bungs/${bungId}`)
}
