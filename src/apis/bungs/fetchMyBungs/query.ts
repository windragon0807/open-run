import { UseQueryOptions, useQuery } from 'react-query'
import { BungInfo } from '@type/bung'
import http from '@apis/axios'
import { Pagination, PaginationResponse } from '@apis/type'
import { toKSTDate } from '@utils/time'

type RequestType = {
  /* null : 전체, true : 내가 벙주인 벙, false : 내가 참여한 벙 */
  isOwned: boolean | null
  /*
   * null : 현재 일자보다 미래 시점의 모든 벙
   * PARTICIPATING : 시작은 했는데 안 끝난 벙
   * ACCOMPLISHED : 완료된 벙
   * ONGOING : 참여 예정 중이거나 진행 중인 벙
   */
  status: 'PARTICIPATING' | 'ACCOMPLISHED' | 'ONGOING' | null
  page: number
  limit: number
}

type ResponseType = PaginationResponse<
  Array<
    Omit<BungInfo, 'startDateTime' | 'endDateTime' | 'memberList'> & {
      startDateTime: string
      endDateTime: string
      isCompleted: boolean
      hasOwnership: boolean
    }
  >
>

type DataType = Pagination & {
  list: Array<
    Omit<BungInfo, 'memberList'> & {
      isCompleted: boolean
      hasOwnership: boolean
    }
  >
}

/** 내가 참여하고 있는 벙 리스트 조회하기 */
export async function fetchMyBungs(request: RequestType): Promise<DataType> {
  const response: ResponseType = await http.get('/v1/bungs/my-bungs', { params: request })
  return {
    ...response,
    list: response.data.map((bungInfo) => ({
      ...bungInfo,
      startDateTime: toKSTDate(bungInfo.startDateTime),
      endDateTime: toKSTDate(bungInfo.endDateTime),
    })),
  }
}

export const queryKey = 'fetchMyBungs'

export function useMyBungsQuery(request: RequestType, options?: UseQueryOptions<DataType>) {
  return useQuery({
    queryKey: [queryKey, request],
    queryFn: () => fetchMyBungs(request),
    suspense: true,
    useErrorBoundary: true,
    ...options,
  })
}
