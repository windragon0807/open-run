import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { RequestType, fetchMyBungs } from './index'

export const myBungsQueries = {
  all: () => ['fetchMyBungs'] as const,
  list: (request: RequestType) =>
    queryOptions({
      queryKey: [...myBungsQueries.all(), request] as const,
      queryFn: () => fetchMyBungs(request),
    }),
}

export function useMyBungsQuery(request: RequestType) {
  return useSuspenseQuery(myBungsQueries.list(request))
}
