import { useQuery } from '@tanstack/react-query'
import { RequestType, searchBungByLocation } from './index'

export function useSearchBungByLocation(request: RequestType) {
  return useQuery({
    queryKey: ['searchBungByLocation', request],
    queryFn: () => searchBungByLocation(request),
  })
}
