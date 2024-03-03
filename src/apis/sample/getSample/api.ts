import http from '@apis/axios'

import { ResponseType } from './type'

export default function getSample() {
  return http.get<ResponseType>('/todos/1')
}
