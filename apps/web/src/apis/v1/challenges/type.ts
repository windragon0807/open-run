import type { ApiDateTime } from '@utils/api'

export type ChallengeType = 'tuto' | 'normal' | 'hidden' | 'repetitive'
export type CompletedType = 'date' | 'place' | 'wearing' | 'pace' | 'count'
export type NftRarity = 'common' | 'rare' | 'epic'

export type ChallengeInfo = {
  challengeId: number
  userChallengeId: number
  challengeName: string
  completedDate: ApiDateTime
  challengeDescription: string
  currentCount: number
  conditionCount: number
  conditionDate: ApiDateTime
  conditionText: string | null
  challengeType: ChallengeType
  completedType: CompletedType
  stageCount: number
  progressStat: number
  accomplished: boolean
  nftCompleted: boolean
}

export type RepetitiveChallengeDetail = {
  challengeId: number
  challengeName: string
  challengeDescription: string
  challengeTrees: Array<{
    userChallengeId: number | null
    completedDate: ApiDateTime
    nftCompleted: boolean
    currentCount: number
    currentProgress: number
    stageId: number
    stageNumber: number
    conditionAsCount: number
  }>
}

export type CompletedChallengeWithNft = {
  challengeId: number
  userChallengeId: number
  challengeName: string
  challengeDescription: string
  completedDate: ApiDateTime
  challengeType: ChallengeType
  completedType: CompletedType
  stageCount: number
  currentCount: number
  conditionCount: number
  nft: {
    tokenId: string | null
    transactionHash: string | null
    name: string | null
    description: string | null
    image: string | null
    category: string | null
    rarity: NftRarity | null
    mintedAt: ApiDateTime
  } | null
}
