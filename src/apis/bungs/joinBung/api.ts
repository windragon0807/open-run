import http from '@apis/axios'
import { RequestType } from './type'

export function joinBung({ bungId }: RequestType) {
  return http.get(`/v1/bungs/${bungId}/join`)
}
