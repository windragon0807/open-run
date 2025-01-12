import { useQuery } from 'react-query'
import { fetchGeocode } from './api'

export function useGeocode(location: string) {
  return useQuery({
    queryKey: ['geocode', location],
    queryFn: () => fetchGeocode({ address: location }),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24,
  })
}
