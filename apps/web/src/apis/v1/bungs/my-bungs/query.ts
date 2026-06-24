import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import type { QueryOptions } from '@type/react-query'
import { RequestType, fetchMyBungs } from './index'

const MY_BUNGS_PAGE_SIZE = 100

type MyBungsListRequest = Omit<RequestType, 'page' | 'limit'>

export const myBungsQueries = {
  all: () => ['fetchMyBungs'] as const,
  list: (request: RequestType) =>
    queryOptions({
      queryKey: [...myBungsQueries.all(), request] as const,
      queryFn: () => fetchMyBungs(request),
    }),
  allList: (request: MyBungsListRequest) =>
    queryOptions({
      queryKey: [...myBungsQueries.all(), 'all', request] as const,
      queryFn: async () => {
        const firstPage = await fetchMyBungs({ ...request, page: 0, limit: MY_BUNGS_PAGE_SIZE })
        if (firstPage.last || firstPage.totalPages <= 1) {
          return firstPage
        }

        const restPages = await Promise.all(
          Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
            fetchMyBungs({ ...request, page: index + 1, limit: MY_BUNGS_PAGE_SIZE }),
          ),
        )

        return {
          ...firstPage,
          data: [firstPage, ...restPages].flatMap((page) => page.data),
          last: restPages.at(-1)?.last ?? firstPage.last,
        }
      },
    }),
}

type UseMyBungsOptions = QueryOptions<ReturnType<typeof myBungsQueries.list>>

export function useMyBungs(request: RequestType, options?: UseMyBungsOptions) {
  return useQuery({
    ...myBungsQueries.list(request),
    ...options,
  })
}

export function useMyBungsQuery(request: RequestType) {
  return useSuspenseQuery(myBungsQueries.list(request))
}

export function useAllMyBungsQuery(request: MyBungsListRequest) {
  return useSuspenseQuery(myBungsQueries.allList(request))
}
