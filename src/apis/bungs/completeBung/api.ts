import http from '@apis/axios'
import { RequestType } from './type'

export function completeBung({ bungId }: RequestType) {
  return http.post(`/v1/bungs/${bungId}/complete`)
}
