import { UseQueryOptions, useQuery } from 'react-query'
import { RequestType, ResponseType, fetchReverseGeocoding } from './index'

export function useReverseGeocoding(request: RequestType, options?: UseQueryOptions<ResponseType>) {
  return useQuery({
    queryKey: ['reverse-geocoding', request],
    queryFn: () => fetchReverseGeocoding(request),
    staleTime: Infinity,
    cacheTime: Infinity,
    ...options,
  })
}
