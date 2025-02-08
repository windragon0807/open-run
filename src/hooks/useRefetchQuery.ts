import { useQueryClient } from 'react-query'

export function useRefetchQuery(queryKey: string) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries([queryKey])
  }
}
