import type { NftRarity } from '@apis/v1/challenges/type'
import http from '@apis/http.client'
import type { ApiResponse } from '@apis/type'
import type { ApiDateTime } from '@utils/api'

export type ProfileSummary = {
  receivedLikeCount: number
  currentOwnedBungCount: number
  acquiredNftCount: number
  recentAcquiredNfts: RecentAcquiredNft[]
}

export type RecentAcquiredNft = {
  userChallengeId: number
  challengeId: number
  challengeName: string
  acquiredAt: ApiDateTime
  nft: {
    tokenId: string | null
    transactionHash: string | null
    name: string | null
    description: string | null
    image: string | null
    category: string | null
    rarity: NftRarity | null
  }
}

export type FetchProfileSummaryResponseType = ApiResponse<ProfileSummary>

export function fetchProfileSummary(): Promise<FetchProfileSummaryResponseType> {
  return http.get('/v1/users/profile-summary')
}
