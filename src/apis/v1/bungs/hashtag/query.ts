import { queryOptions, useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import { RequestType, ResponseType, searchBungByHashtag } from './index'

export function searchBungByHashtagQueryOptions(request: RequestType, options?: QueryOptions<ResponseType>) {
  return queryOptions({
    queryKey: ['searchBungByHashtag', request] as const,
    queryFn: () => searchBungByHashtag(request),
    ...options,
  })
}

export function useSearchBungByHashtag(request: RequestType, options?: QueryOptions<ResponseType>) {
  return useQuery(searchBungByHashtagQueryOptions(request, options))
}
