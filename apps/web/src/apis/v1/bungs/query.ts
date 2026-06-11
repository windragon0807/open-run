import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { FetchBungsRequestType, fetchBungs } from './index'

export const bungsQueries = {
  all: () => ['fetchBungs'] as const,
  list: (request: FetchBungsRequestType) =>
    queryOptions({
      queryKey: [...bungsQueries.all(), request] as const,
      queryFn: () => fetchBungs(request),
    }),
}

export function useBungsQuery(request: FetchBungsRequestType) {
  return useSuspenseQuery(bungsQueries.list(request))
}
