import { useQuery, useQueryClient } from 'react-query'
import { RequestType } from './type'
import { baseUrl, fetchMyBungs } from './api'

export function useMyBungs(params: RequestType) {
  return useQuery({
    queryKey: [baseUrl, params],
    queryFn: () => fetchMyBungs(params),
  })
}

export function useMyBungsClient() {
  const queryClient = useQueryClient()
  const refetch = () => {
    queryClient.invalidateQueries([baseUrl])
  }

  return { refetch }
}
