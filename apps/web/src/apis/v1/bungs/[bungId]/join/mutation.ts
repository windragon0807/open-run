import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bungDetailQueries } from '../query'
import { joinBung } from './index'

export function useJoinBung() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: joinBung,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: bungDetailQueries.detail({ bungId: variables.bungId }).queryKey,
      })
    },
  })
}
