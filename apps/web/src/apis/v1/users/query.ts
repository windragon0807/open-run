import { queryOptions, useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { QueryOptions } from '@type/react-query'
import { FetchUserInfoResponseType, fetchUserInfo } from './index'

export const userQueries = {
  all: () => ['fetchUserInfo'] as const,
  me: () =>
    queryOptions({
      queryKey: userQueries.all(),
      queryFn: fetchUserInfo,
      staleTime: Infinity,
      gcTime: Infinity,
    }),
}

type UseUserInfoOptions = QueryOptions<ReturnType<typeof userQueries.me>> & {
  onSuccess?: (data: FetchUserInfoResponseType) => void
}

export function useUserInfo(options?: UseUserInfoOptions) {
  const { onSuccess, ...queryOptionOverrides } = options ?? {}
  const onSuccessRef = useRef(onSuccess)
  const handledDataUpdatedAtRef = useRef(0)

  const query = useQuery({
    ...userQueries.me(),
    ...queryOptionOverrides,
  })

  useEffect(() => {
    onSuccessRef.current = onSuccess
  }, [onSuccess])

  useEffect(() => {
    if (!query.data) return
    if (query.dataUpdatedAt === handledDataUpdatedAtRef.current) return

    handledDataUpdatedAtRef.current = query.dataUpdatedAt
    onSuccessRef.current?.(query.data)
  }, [query.data, query.dataUpdatedAt])

  return query
}
