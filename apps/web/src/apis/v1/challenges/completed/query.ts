import { queryOptions, useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import { CHALLENGE_LIST_GC_TIME_MS, CHALLENGE_LIST_STALE_TIME_MS } from '../general/query'
import {
  CompletedChallengeListRequest,
  CompletedChallengeWithNftListResponse,
  fetchCompletedChallengeWithNftList,
} from './index'

export const completedChallengeQueries = {
  all: () => ['challenges', 'completed-with-nft'] as const,
  withNft: (request?: CompletedChallengeListRequest) =>
    queryOptions({
      queryKey: [...completedChallengeQueries.all(), request] as const,
      queryFn: () => fetchCompletedChallengeWithNftList(request),
      staleTime: CHALLENGE_LIST_STALE_TIME_MS,
      gcTime: CHALLENGE_LIST_GC_TIME_MS,
    }),
}

export function useCompletedChallengeWithNftListQuery(
  request?: CompletedChallengeListRequest,
  options?: QueryOptions<ReturnType<typeof completedChallengeQueries.withNft>>,
) {
  return useQuery({
    ...completedChallengeQueries.withNft(request),
    ...options,
  })
}
