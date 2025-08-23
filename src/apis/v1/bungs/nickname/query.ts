import { queryOptions, useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import { RequestType, ResponseType, searchBungByNickname } from './index'

export function searchBungByNicknameQueryOptions(request: RequestType, options?: QueryOptions<ResponseType>) {
  return queryOptions({
    queryKey: ['searchBungByNickname', request] as const,
    queryFn: () => searchBungByNickname(request),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 5, // 5분
    ...options,
  })
}

export function useSearchBungByNickname(request: RequestType, options?: QueryOptions<ResponseType>) {
  return useQuery(searchBungByNicknameQueryOptions(request, options))
}
