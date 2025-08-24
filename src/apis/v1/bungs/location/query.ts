import { useInfiniteQuery } from '@tanstack/react-query'
import { UseInfiteQueryOptions } from '@type/react-query'
import { RequestType, ResponseType, searchBungByLocation } from './index'

export function useInfiniteSearchBungByLocation(request: RequestType, options?: UseInfiteQueryOptions<ResponseType>) {
  return useInfiniteQuery({
    queryKey: ['searchBungByLocation', request] as const,
    queryFn: ({ pageParam = 0 }) => searchBungByLocation({ ...request, page: pageParam as number, limit: 10 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // lastPage가 undefined이거나 마지막 페이지이거나 더 이상 페이지가 없으면 undefined 반환
      if (!lastPage || lastPage.last || lastPage.empty) {
        return undefined
      }
      // 다음 페이지 번호 반환 (현재까지 로드된 페이지 수)
      return allPages.length
    },
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 5, // 5분
    ...options,
  })
}
