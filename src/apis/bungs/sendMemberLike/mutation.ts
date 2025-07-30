import { useMutation } from '@tanstack/react-query'
import http from '@apis/axios'

type RequestType = {
  targetUserIds: string[]
}

function sendMemberLike(params: RequestType) {
  return http.patch('/v1/users/feedback', params)
}

export function useSendMemberLike() {
  return useMutation({
    mutationFn: sendMemberLike,
  })
}
