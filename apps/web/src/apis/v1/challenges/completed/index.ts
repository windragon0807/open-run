'server-only'

import { http } from '@apis/http.server'
import { PaginationResponse } from '@apis/type'
import type { ChallengeInfo, CompletedChallengeWithNft } from '../type'

type RequestType = {
  page?: number
  limit?: number
}

type ResponseType = PaginationResponse<ChallengeInfo[]>
type CompletedWithNftResponseType = PaginationResponse<CompletedChallengeWithNft[]>

export async function fetchCompletedChallengeList(params?: RequestType): Promise<ResponseType> {
  return http.get({
    url: `${process.env.NEXT_PUBLIC_API_SERVER_URL}/v1/challenges/completed`,
    params,
  })
}

export async function fetchCompletedChallengeWithNftList(params?: RequestType): Promise<CompletedWithNftResponseType> {
  return http.get({
    url: `${process.env.NEXT_PUBLIC_API_SERVER_URL}/v1/challenges/completed-with-nft`,
    params,
  })
}
