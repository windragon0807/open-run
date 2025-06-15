import { useQuery } from 'react-query'
import { BungInfo } from '@type/bung'
import http from '@apis/axios'
import { PaginationResponse } from '@apis/type'

type RequestType = {
  /**
   * true : 참가할 수 있는 벙만 보여집니다.
   * false : 이미 참가한 벙도 보여집니다.
   */
  isAvailableOnly: boolean
  page: number
  limit: number
}

type ResponseType = PaginationResponse<Array<Omit<BungInfo, 'memberList'>>>

/** 벙 목록을 보는 경우 (전체보기, 내가 참여한 벙만 보기) */
export function fetchBungs(request: RequestType): Promise<ResponseType> {
  return http.get('/v1/bungs', { params: request })
}

export const queryKey = 'fetchBungs'

export function useBungsQuery(request: RequestType) {
  return useQuery({
    queryKey: [queryKey, request],
    queryFn: () => fetchBungs(request),
    suspense: true,
    useErrorBoundary: true,
  })
}
