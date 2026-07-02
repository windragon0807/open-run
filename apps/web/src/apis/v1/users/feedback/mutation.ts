import { useMutation, useQueryClient } from '@tanstack/react-query'
import { myBungsQueries } from '@apis/v1/bungs/my-bungs/query'
import { profileSummaryQueries } from '../profile-summary/query'
import { sendMemberLike } from './index'

export function useSendMemberLike() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendMemberLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileSummaryQueries.all() })
      queryClient.invalidateQueries({ queryKey: myBungsQueries.all() })
    },
  })
}
