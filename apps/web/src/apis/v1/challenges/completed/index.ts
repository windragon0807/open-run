import { PaginationResponse } from '@apis/type'
import type { ChallengeInfo, CompletedChallengeWithNft } from '../type'

export type CompletedChallengeListRequest = {
  page?: number
  limit?: number
}

export type CompletedChallengeListResponse = PaginationResponse<ChallengeInfo[]>
export type CompletedChallengeWithNftListResponse = PaginationResponse<CompletedChallengeWithNft[]>

export function fetchCompletedChallengeList(
  params?: CompletedChallengeListRequest,
): Promise<CompletedChallengeListResponse> {
  return fetchChallengeList('/api/challenges/completed', params)
}

export function fetchCompletedChallengeWithNftList(
  params?: CompletedChallengeListRequest,
): Promise<CompletedChallengeWithNftListResponse> {
  return fetchChallengeList('/api/challenges/completed-with-nft', params)
}

async function fetchChallengeList<Response>(path: string, params?: CompletedChallengeListRequest): Promise<Response> {
  const query = new URLSearchParams()
  if (params?.page != null) query.set('page', params.page.toString())
  if (params?.limit != null) query.set('limit', params.limit.toString())

  const response = await fetch(query.size > 0 ? `${path}?${query.toString()}` : path)
  if (!response.ok) {
    throw new Error('Failed to fetch challenge list')
  }

  return response.json()
}
