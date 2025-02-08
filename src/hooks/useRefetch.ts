import { useRouter } from 'next/navigation'
import { useQueryClient } from 'react-query'

export function useRefetch() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries()
    router.refresh()
  }
}
