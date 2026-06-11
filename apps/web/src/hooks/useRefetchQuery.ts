import type { QueryKey } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'

export function useRefetchQuery(queryKey: QueryKey) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey })
  }
}
