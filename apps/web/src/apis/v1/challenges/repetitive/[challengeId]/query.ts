import { queryOptions, useQuery } from '@tanstack/react-query'
import { RequestType, fetchRepetitiveChallengeDetail } from './index'

export const repetitiveChallengeDetailQueries = {
  detail: (request: RequestType) =>
    queryOptions({
      queryKey: ['repetitiveChallengeDetail', request] as const,
      queryFn: () => fetchRepetitiveChallengeDetail(request),
    }),
}

export const useRepetitiveChallengeDetail = (request: RequestType) => {
  return useQuery(repetitiveChallengeDetailQueries.detail(request))
}
