import { BungInfo } from '@type/bung'
import http from '@apis/axios'
import { PaginationResponse } from '@apis/type'

export type RequestType = {
  hashtag: string
  page?: number
  limit?: number
}

export type ResponseType = PaginationResponse<Array<BungInfo>>

export function searchBungByHashtag(request: RequestType): Promise<ResponseType> {
  return http.get('/v1/bungs/hashtag', { params: request })
}
