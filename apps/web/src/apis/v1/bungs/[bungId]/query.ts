import { queryOptions, useQuery } from '@tanstack/react-query'
import type { QueryOptions } from '@type/react-query'
import { FetchBungDetailRequestType, fetchBungDetail } from './index'

export const BUNG_DETAIL_STALE_TIME_MS = 1000 * 60 * 5
export const BUNG_DETAIL_GC_TIME_MS = 1000 * 60 * 10

export const bungDetailQueries = {
  all: () => ['fetchBungDetail'] as const,
  detail: (request: FetchBungDetailRequestType) =>
    queryOptions({
      queryKey: [...bungDetailQueries.all(), request] as const,
      queryFn: () => fetchBungDetail(request),
      staleTime: BUNG_DETAIL_STALE_TIME_MS,
      gcTime: BUNG_DETAIL_GC_TIME_MS,
    }),
}

type UseBungDetailOptions = QueryOptions<ReturnType<typeof bungDetailQueries.detail>>

export function useBungDetailQuery(request: FetchBungDetailRequestType, options?: UseBungDetailOptions) {
  return useQuery({
    ...bungDetailQueries.detail(request),
    ...options,
  })
}
