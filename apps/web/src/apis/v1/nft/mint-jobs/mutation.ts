import { useMutation, useQueryClient } from '@tanstack/react-query'
import { completedChallengeQueries } from '../../challenges/completed/query'
import { generalChallengeQueries } from '../../challenges/general/query'
import { repetitiveChallengeQueries } from '../../challenges/repetitive/query'
import { nftAvatarQueries } from '../avatar-items/query'
import { MintJobResponseType, StartMintJobRequestType, startMintJob } from './index'

export function useStartMintJobMutation() {
  const queryClient = useQueryClient()

  return useMutation<MintJobResponseType, Error, StartMintJobRequestType>({
    mutationFn: startMintJob,
    onSuccess: (response) => {
      if (response.data.status !== 'SUCCESS') return

      queryClient.invalidateQueries({ queryKey: nftAvatarQueries.ownedItems().queryKey })

      /* 보상 수령 후 도전과제 목록의 "보상 받기" 버튼 상태가 stale 하지 않도록 목록 쿼리들을 invalidate */
      queryClient.invalidateQueries({ queryKey: generalChallengeQueries.all() })
      queryClient.invalidateQueries({ queryKey: repetitiveChallengeQueries.all() })
      queryClient.invalidateQueries({ queryKey: completedChallengeQueries.all() })
    },
  })
}
