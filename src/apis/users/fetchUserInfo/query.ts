import { UseQueryOptions, useQuery } from 'react-query'
import { ResponseType } from './type'
import { fetchUserInfo } from './api'

export function useUserInfo(options?: UseQueryOptions<ResponseType>) {
  return useQuery({
    queryKey: ['fetchUserInfo'],
    queryFn: fetchUserInfo,
    staleTime: Infinity,
    cacheTime: Infinity,
    ...options,
  })
}
