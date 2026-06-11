import { queryOptions, useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import { RequestType, ResponseType, fetchReverseGeocoding } from './index'

export const reverseGeocodingQueries = {
  detail: (request: RequestType) =>
    queryOptions({
      queryKey: ['reverse-geocoding', request] as const,
      queryFn: () => fetchReverseGeocoding(request),
      staleTime: Infinity,
      gcTime: Infinity,
    }),
}

export function useReverseGeocoding(
  request: RequestType,
  options?: QueryOptions<ReturnType<typeof reverseGeocodingQueries.detail>>,
) {
  return useQuery({
    ...reverseGeocodingQueries.detail(request),
    ...options,
  })
}
