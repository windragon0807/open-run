import { queryOptions, useQuery } from '@tanstack/react-query'
import type { QueryOptions } from '@type/react-query'
import { fetchProfileSummary } from './index'

export const PROFILE_SUMMARY_STALE_TIME_MS = 60_000
export const PROFILE_SUMMARY_GC_TIME_MS = 5 * 60_000

export const profileSummaryQueries = {
  all: () => ['profileSummary'] as const,
  me: () =>
    queryOptions({
      queryKey: profileSummaryQueries.all(),
      queryFn: fetchProfileSummary,
      staleTime: PROFILE_SUMMARY_STALE_TIME_MS,
      gcTime: PROFILE_SUMMARY_GC_TIME_MS,
    }),
}

type UseProfileSummaryOptions = QueryOptions<ReturnType<typeof profileSummaryQueries.me>>

export function useProfileSummary(options?: UseProfileSummaryOptions) {
  return useQuery({
    ...profileSummaryQueries.me(),
    ...options,
  })
}
