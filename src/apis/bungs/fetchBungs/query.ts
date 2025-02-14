import { useQuery, UseQueryOptions } from 'react-query'
import { PaginationResponse, Pagination } from '@apis/type'
import http from '@apis/axios'
import { toKSTDate } from '@utils/time'
import { BungInfo } from '@type/bung'

export type RequestType = {
  /**
   * true : 참가할 수 있는 벙만 보여집니다.
   * false : 이미 참가한 벙도 보여집니다.
   */
  isAvailableOnly: boolean
  page: number
  limit: number
}

export type ResponseType = PaginationResponse<
  Array<
    Omit<BungInfo, 'startDateTime' | 'endDateTime' | 'memberList'> & {
      startDateTime: string
      endDateTime: string
    }
  >
>

type DataType = Pagination & {
  list: Array<Omit<BungInfo, 'memberList'>>
}

/** 벙 목록을 보는 경우 (전체보기, 내가 참여한 벙만 보기) */
export async function fetchBungs(request: RequestType): Promise<DataType> {
  const response: ResponseType = await http.get('/v1/bungs', { params: request })
  return {
    ...response,
    list: response.data.map((bungInfo) => ({
      ...bungInfo,
      startDateTime: toKSTDate(bungInfo.startDateTime),
      endDateTime: toKSTDate(bungInfo.endDateTime),
    })),
  }
}

export const queryKey = 'fetchBungs'

export function useBungsQuery(request: RequestType, options?: UseQueryOptions<DataType>) {
  return useQuery({
    queryKey: [queryKey, request],
    queryFn: () => fetchBungs(request),
    suspense: true,
    useErrorBoundary: true,
    ...options,
  })
}
