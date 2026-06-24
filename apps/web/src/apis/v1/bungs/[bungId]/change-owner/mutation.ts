import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bungDetailQueries } from '../query'
import { delegateOwner } from './index'

export function useDelegateOwner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: delegateOwner,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: bungDetailQueries.detail({ bungId: variables.bungId }).queryKey,
      })
    },
  })
}
