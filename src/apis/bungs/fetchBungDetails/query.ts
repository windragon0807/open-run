import http from '@apis/axios'
import { ApiResponse } from '@apis/type'
import { BungInfo } from '@type/bung'
import { toKSTDate } from '@utils/time'

export type RequestType = {
  bungId: string
}

export type ResponseType = ApiResponse<
  Omit<BungInfo, 'startDateTime' | 'endDateTime'> & {
    startDateTime: string
    endDateTime: string
  }
>

export type DataType = BungInfo

/** 벙 정보 상세보기 */
export async function fetchBungDetail({ bungId }: RequestType): Promise<DataType> {
  const response: ResponseType = await http.get(`/v1/bungs/${bungId}`)
  const data = response.data
  return {
    ...data,
    startDateTime: toKSTDate(data.startDateTime),
    endDateTime: toKSTDate(data.endDateTime),
  }
}
