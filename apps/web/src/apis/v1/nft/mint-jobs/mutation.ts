import { useMutation, useQueryClient } from '@tanstack/react-query'
import { OWNED_NFT_AVATAR_ITEMS_QUERY_KEY } from '../avatar-items/query'
import { MintJobResponseType, StartMintJobRequestType, startMintJob } from './index'

export function useStartMintJobMutation() {
  const queryClient = useQueryClient()

  return useMutation<MintJobResponseType, Error, StartMintJobRequestType>({
    mutationFn: startMintJob,
    onSuccess: (response) => {
      if (response.data.status !== 'SUCCESS') return

      queryClient.invalidateQueries({ queryKey: OWNED_NFT_AVATAR_ITEMS_QUERY_KEY })
    },
  })
}
