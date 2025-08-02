import { useQuery } from '@tanstack/react-query'
import { RequestType, searchBungByHashtag } from './index'

export function useSearchBungByHashtag(request: RequestType) {
  return useQuery({
    queryKey: ['searchBungByHashtag', request],
    queryFn: () => searchBungByHashtag(request),
  })
}
