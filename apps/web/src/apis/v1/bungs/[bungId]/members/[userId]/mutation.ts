import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bungDetailQueries } from '../../query'
import { dropoutMember } from './index'

export function useDropoutMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dropoutMember,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: bungDetailQueries.detail({ bungId: variables.bungId }).queryKey,
      })
    },
  })
}
