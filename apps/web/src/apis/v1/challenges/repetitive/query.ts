import { queryOptions, useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import { CHALLENGE_LIST_GC_TIME_MS, CHALLENGE_LIST_STALE_TIME_MS } from '../general/query'
import {
  RepetitiveChallengeListRequest,
  RepetitiveChallengeListResponse,
  fetchRepetitiveChallengeList,
} from './index'

export const repetitiveChallengeQueries = {
  all: () => ['challenges', 'repetitive'] as const,
  list: (request?: RepetitiveChallengeListRequest) =>
    queryOptions({
      queryKey: [...repetitiveChallengeQueries.all(), request] as const,
      queryFn: () => fetchRepetitiveChallengeList(request),
      staleTime: CHALLENGE_LIST_STALE_TIME_MS,
      gcTime: CHALLENGE_LIST_GC_TIME_MS,
    }),
}

export function useRepetitiveChallengeListQuery(
  request?: RepetitiveChallengeListRequest,
  options?: QueryOptions<ReturnType<typeof repetitiveChallengeQueries.list>>,
) {
  return useQuery({
    ...repetitiveChallengeQueries.list(request),
    ...options,
  })
}
