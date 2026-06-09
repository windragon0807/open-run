import { useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import { GeneralChallengeListRequest, GeneralChallengeListResponse, fetchGeneralChallengeList } from './index'

export const GENERAL_CHALLENGE_LIST_QUERY_KEY = ['challenges', 'general'] as const
export const CHALLENGE_LIST_STALE_TIME_MS = 1000 * 60 * 5
export const CHALLENGE_LIST_GC_TIME_MS = 1000 * 60 * 10

export function useGeneralChallengeListQuery(
  request?: GeneralChallengeListRequest,
  options?: QueryOptions<GeneralChallengeListResponse>,
) {
  return useQuery({
    queryKey: [...GENERAL_CHALLENGE_LIST_QUERY_KEY, request] as const,
    queryFn: () => fetchGeneralChallengeList(request),
    staleTime: CHALLENGE_LIST_STALE_TIME_MS,
    gcTime: CHALLENGE_LIST_GC_TIME_MS,
    ...options,
  })
}
