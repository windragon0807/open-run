import http from '@apis/axios'
import { RequestType } from './type'

export function completeBung({ bungId }: RequestType) {
  return http.patch(`/v1/bungs/${bungId}/complete`)
}
