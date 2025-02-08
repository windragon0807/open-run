import { useQuery } from 'react-query'
import { RequestType } from './type'
import { fetchBungs } from './api'

export function useBungs(params: RequestType) {
  return useQuery({
    queryKey: ['fetchBungs', params],
    queryFn: async () => {
      const response = await fetchBungs(params)
      return response.data
    },
  })
}
