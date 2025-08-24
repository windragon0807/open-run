import { useSuspenseQuery } from '@tanstack/react-query'
import { FetchBungsRequestType, fetchBungs } from './index'

export function useBungsQuery(request: FetchBungsRequestType) {
  return useSuspenseQuery({
    queryKey: ['fetchBungs', request],
    queryFn: () => fetchBungs(request),
  })
}
