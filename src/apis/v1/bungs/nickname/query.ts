import { useQuery } from '@tanstack/react-query'
import { RequestType, searchBungByNickname } from './index'

export function useSearchBungByNickname(request: RequestType) {
  return useQuery({
    queryKey: ['searchBungByNickname', request],
    queryFn: () => searchBungByNickname(request),
  })
}
