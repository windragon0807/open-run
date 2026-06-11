import { infiniteQueryOptions, queryOptions, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { QueryOptions, UseInfiteQueryOptions } from '@type/react-query'
import { SearchBungsRequestType, SearchBungsResponseType, searchBungs } from './index'

export const searchBungsQueries = {
  all: () => ['searchBungs'] as const,
  list: (request: SearchBungsRequestType) =>
    queryOptions({
      queryKey: [...searchBungsQueries.all(), request] as const,
      queryFn: () => searchBungs(request),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 5,
    }),
  infiniteList: (request: SearchBungsRequestType) =>
    infiniteQueryOptions({
      queryKey: [...searchBungsQueries.all(), 'infinite', request] as const,
      queryFn: ({ pageParam = 0 }) => searchBungs({ ...request, page: pageParam as number }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        const categoryResult = lastPage.data.categories[0]
        if (!categoryResult || categoryResult.last || categoryResult.empty) {
          return undefined
        }

        return allPages.length
      },
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 5,
    }),
}

export function useSearchBungsQuery(
  request: SearchBungsRequestType,
  options?: QueryOptions<ReturnType<typeof searchBungsQueries.list>>,
) {
  return useQuery({
    ...searchBungsQueries.list(request),
    ...options,
  })
}

export function useInfiniteSearchBungsQuery(
  request: SearchBungsRequestType,
  options?: UseInfiteQueryOptions<ReturnType<typeof searchBungsQueries.infiniteList>>,
) {
  return useInfiniteQuery({
    ...searchBungsQueries.infiniteList(request),
    ...options,
  })
}
