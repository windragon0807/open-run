import { BungInfo } from '@type/bung'
import http from '@apis/axios'
import { PaginationResponse } from '@apis/type'

export type RequestType = {
  nickname: string
  page?: number
  limit?: number
}

type ResponseType = PaginationResponse<Array<BungInfo>>

export function searchBungByNickname(request: RequestType): Promise<ResponseType> {
  return http.get('/v1/bungs/nickname', { params: request })
}
