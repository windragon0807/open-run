import { useQuery, useQueryClient } from 'react-query'
import { RequestType, ResponseType } from './type'
import { baseUrl, fetchMyBungs } from './api'

export function useMyBungs(params: RequestType) {
  const { data, isLoading } = useQuery({
    queryKey: [baseUrl, params],
    queryFn: () => fetchMyBungs(params),
  })

  return {
    data: data?.data as ResponseType['data'],
    isLoading,
    isSuccess: data != null && data.data.length > 0,
    isEmpty: data != null && data.data.length === 0,
  }
}

export function useMyBungsClient() {
  const queryClient = useQueryClient()
  const refetch = () => {
    queryClient.invalidateQueries([baseUrl])
  }

  return { refetch }
}
