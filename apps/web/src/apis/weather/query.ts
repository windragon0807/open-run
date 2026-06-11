import { queryOptions, useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import { RequestType, ResponseType, fetchCurrentWeather } from './index'

export const weatherQueries = {
  current: (request: RequestType) =>
    queryOptions({
      queryKey: ['current-weather', request] as const,
      queryFn: () => fetchCurrentWeather(request),
      staleTime: 1_000 * 60 * 60,
      gcTime: 1_000 * 60 * 60,
    }),
}

export function useCurrentWeather(request: RequestType, options?: QueryOptions<ReturnType<typeof weatherQueries.current>>) {
  return useQuery({
    ...weatherQueries.current(request),
    ...options,
  })
}
