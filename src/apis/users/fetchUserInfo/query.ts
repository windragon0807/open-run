import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { QueryOptions } from '@type/react-query'
import { ResponseType, fetchUserInfo } from './api'

export function useUserInfo(options?: QueryOptions<ResponseType>) {
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
