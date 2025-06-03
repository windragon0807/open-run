import { useQuery } from 'react-query'
import { RequestType, fetchGeocoding } from './index'

export function useGeocoding(request: RequestType) {
  return useQuery({
    queryKey: ['geocoding', request],
    queryFn: () => fetchGeocoding({ address: request.address }),
    staleTime: Infinity,
    cacheTime: Infinity,
  })
}
