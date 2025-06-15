import { BungInfo } from '@type/bung'
import http from '@apis/axios'
import { ApiResponse } from '@apis/type'

type RequestType = {
  bungId: string
}

type ResponseType = ApiResponse<
  Omit<BungInfo, 'startDateTime' | 'endDateTime'> & {
    startDateTime: string
    endDateTime: string
  }
>

/** 벙 정보 상세보기 */
export function fetchBungDetail({ bungId }: RequestType): Promise<ResponseType> {
  return http.get(`/v1/bungs/${bungId}`)
}
