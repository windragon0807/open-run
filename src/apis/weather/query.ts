import { UseQueryOptions, useQuery } from 'react-query'
import { RequestType, ResponseType, fetchCurrentWeather } from './index'

export function useCurrentWeather(request: RequestType, options?: UseQueryOptions<ResponseType>) {
  return useQuery({
    queryKey: ['current-weather', request],
    queryFn: () => fetchCurrentWeather(request),
    staleTime: 1_000 * 60 * 60, // 1시간
    cacheTime: 1_000 * 60 * 60, // 1시간
    ...options,
  })
}
