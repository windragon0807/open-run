import { BungInfo } from '@type/bung'
import http from '@apis/axios'
import { PaginationResponse } from '@apis/type'

export type RequestType = {
  location: string
  page?: number
  limit?: number
}

type ResponseType = PaginationResponse<Array<BungInfo>>

export function searchBungByLocation(request: RequestType): Promise<ResponseType> {
  return http.get('/v1/bungs/location', { params: request })
}
