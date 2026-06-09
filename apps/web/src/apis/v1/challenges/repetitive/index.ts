import { PaginationResponse } from '@apis/type'
import type { ChallengeInfo } from '../type'

export type RepetitiveChallengeListRequest = {
  page?: number
  limit?: number
}

export type RepetitiveChallengeListResponse = PaginationResponse<ChallengeInfo[]>

export function fetchRepetitiveChallengeList(
  params?: RepetitiveChallengeListRequest,
): Promise<RepetitiveChallengeListResponse> {
  return fetchChallengeList('/api/challenges/repetitive', params)
}

async function fetchChallengeList<Response>(path: string, params?: RepetitiveChallengeListRequest): Promise<Response> {
  const query = new URLSearchParams()
  if (params?.page != null) query.set('page', params.page.toString())
  if (params?.limit != null) query.set('limit', params.limit.toString())

  const response = await fetch(query.size > 0 ? `${path}?${query.toString()}` : path)
  if (!response.ok) {
    throw new Error('Failed to fetch challenge list')
  }

  return response.json()
}
