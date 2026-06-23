import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import type { QueryOptions } from '@type/react-query'
import { RequestType, fetchMyBungs } from './index'

export const myBungsQueries = {
  all: () => ['fetchMyBungs'] as const,
  list: (request: RequestType) =>
    queryOptions({
      queryKey: [...myBungsQueries.all(), request] as const,
      queryFn: () => fetchMyBungs(request),
    }),
}

type UseMyBungsOptions = QueryOptions<ReturnType<typeof myBungsQueries.list>>

export function useMyBungs(request: RequestType, options?: UseMyBungsOptions) {
  return useQuery({
    ...myBungsQueries.list(request),
    ...options,
  })
}

export function useMyBungsQuery(request: RequestType) {
  return useSuspenseQuery(myBungsQueries.list(request))
}
