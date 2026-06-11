import { queryOptions, useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import { GeneralChallengeListRequest, GeneralChallengeListResponse, fetchGeneralChallengeList } from './index'

export const CHALLENGE_LIST_STALE_TIME_MS = 1000 * 60 * 5
export const CHALLENGE_LIST_GC_TIME_MS = 1000 * 60 * 10

export const generalChallengeQueries = {
  all: () => ['challenges', 'general'] as const,
  list: (request?: GeneralChallengeListRequest) =>
    queryOptions({
      queryKey: [...generalChallengeQueries.all(), request] as const,
      queryFn: () => fetchGeneralChallengeList(request),
      staleTime: CHALLENGE_LIST_STALE_TIME_MS,
      gcTime: CHALLENGE_LIST_GC_TIME_MS,
    }),
}

export function useGeneralChallengeListQuery(
  request?: GeneralChallengeListRequest,
  options?: QueryOptions<ReturnType<typeof generalChallengeQueries.list>>,
) {
  return useQuery({
    ...generalChallengeQueries.list(request),
    ...options,
  })
}
