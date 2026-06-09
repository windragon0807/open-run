import { useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import { CHALLENGE_LIST_GC_TIME_MS, CHALLENGE_LIST_STALE_TIME_MS } from '../general/query'
import {
  RepetitiveChallengeListRequest,
  RepetitiveChallengeListResponse,
  fetchRepetitiveChallengeList,
} from './index'

export const REPETITIVE_CHALLENGE_LIST_QUERY_KEY = ['challenges', 'repetitive'] as const

export function useRepetitiveChallengeListQuery(
  request?: RepetitiveChallengeListRequest,
  options?: QueryOptions<RepetitiveChallengeListResponse>,
) {
  return useQuery({
    queryKey: [...REPETITIVE_CHALLENGE_LIST_QUERY_KEY, request] as const,
    queryFn: () => fetchRepetitiveChallengeList(request),
    staleTime: CHALLENGE_LIST_STALE_TIME_MS,
    gcTime: CHALLENGE_LIST_GC_TIME_MS,
    ...options,
  })
}
