import { useMutation, useQueryClient } from '@tanstack/react-query'
import { nftAvatarQueries } from '../avatar-items/query'
import { MintJobResponseType, StartMintJobRequestType, startMintJob } from './index'

export function useStartMintJobMutation() {
  const queryClient = useQueryClient()

  return useMutation<MintJobResponseType, Error, StartMintJobRequestType>({
    mutationFn: startMintJob,
    onSuccess: (response) => {
      if (response.data.status !== 'SUCCESS') return

      queryClient.invalidateQueries({ queryKey: nftAvatarQueries.ownedItems().queryKey })
    },
  })
}
