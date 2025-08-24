import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { QueryOptions } from '@type/react-query'
import { FetchUserInfoResponseType, fetchUserInfo } from './index'

export function useUserInfo(options?: QueryOptions<FetchUserInfoResponseType>) {
  const { onSuccess, ...queryOptions } = options ?? {}

  const query = useQuery({
    queryKey: ['fetchUserInfo'],
    queryFn: fetchUserInfo,
    staleTime: Infinity,
    gcTime: Infinity,
    ...queryOptions,
  })

  useEffect(() => {
    if (query.data) {
      onSuccess?.(query.data)
    }
  }, [query.data])

  return query
}
