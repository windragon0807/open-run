import { queryOptions, useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import { RequestType, ResponseType, searchBungByLocation } from './index'

export function searchBungByLocationQueryOptions(request: RequestType, options?: QueryOptions<ResponseType>) {
  return queryOptions({
    queryKey: ['searchBungByLocation', request] as const,
    queryFn: () => searchBungByLocation(request),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 5, // 5분
    ...options,
  })
}

export function useSearchBungByLocation(request: RequestType, options?: QueryOptions<ResponseType>) {
  return useQuery(searchBungByLocationQueryOptions(request, options))
}
