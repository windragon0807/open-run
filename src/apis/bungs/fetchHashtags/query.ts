import { useMutation } from 'react-query'
import http, { ApiResponse } from '@apis/axios'

type RequestType = {
  tag: string
}

type ResponseType = ApiResponse<string[]>

/**
 * 벙 목록을 보는 경우 (전체보기, 내가 참여한 벙만 보기)
 */
function fetchHashtags(params: RequestType): Promise<ResponseType> {
  return http.get('/v1/bungs/hashtags', { params })
}

export function useHashtagsMutation() {
  return useMutation(fetchHashtags)
}
