import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveWearingNftAvatarWithProfileImage } from './index'
import { nftAvatarQueries } from './query'

export function useSaveWearingNftAvatarWithProfileImageMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveWearingNftAvatarWithProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nftAvatarQueries.wearing().queryKey })
    },
  })
}
