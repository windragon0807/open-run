import { useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import { CHALLENGE_LIST_GC_TIME_MS, CHALLENGE_LIST_STALE_TIME_MS } from '../general/query'
import {
  CompletedChallengeListRequest,
  CompletedChallengeWithNftListResponse,
  fetchCompletedChallengeWithNftList,
} from './index'

export const COMPLETED_CHALLENGE_WITH_NFT_LIST_QUERY_KEY = ['challenges', 'completed-with-nft'] as const

export function useCompletedChallengeWithNftListQuery(
  request?: CompletedChallengeListRequest,
  options?: QueryOptions<CompletedChallengeWithNftListResponse>,
) {
  return useQuery({
    queryKey: [...COMPLETED_CHALLENGE_WITH_NFT_LIST_QUERY_KEY, request] as const,
    queryFn: () => fetchCompletedChallengeWithNftList(request),
    staleTime: CHALLENGE_LIST_STALE_TIME_MS,
    gcTime: CHALLENGE_LIST_GC_TIME_MS,
    ...options,
  })
}
