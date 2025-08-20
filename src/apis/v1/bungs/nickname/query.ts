import { queryOptions, useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import { RequestType, ResponseType, searchBungByNickname } from './index'

export function searchBungByNicknameQueryOptions(request: RequestType, options?: QueryOptions<ResponseType>) {
  return queryOptions({
    queryKey: ['searchBungByNickname', request] as const,
    queryFn: () => searchBungByNickname(request),
    ...options,
  })
}

export function useSearchBungByNickname(request: RequestType, options?: QueryOptions<ResponseType>) {
  return useQuery(searchBungByNicknameQueryOptions(request, options))
}
