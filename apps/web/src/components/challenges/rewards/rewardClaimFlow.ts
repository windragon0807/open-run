export const MAX_MINT_JOB_ATTEMPTS = 2

type RewardClaimMintStatus = 'PENDING' | 'MINTING' | 'SUCCESS' | 'FAILED'

type RewardClaimAttemptDecision = 'reveal' | 'retry' | 'fallback'

type RewardClaimAttemptDecisionParams = {
  attempt: number
  status: RewardClaimMintStatus | null
  hasRewardPayload: boolean
  maxAttempts?: number
}

type RewardPayloadFields = {
  nftName: string | null
  nftImage: string | null
  nftRarity: string | null
  nftCategory: string | null
}

export function getRewardClaimAttemptDecision({
  attempt,
  status,
  hasRewardPayload,
  maxAttempts = MAX_MINT_JOB_ATTEMPTS,
}: RewardClaimAttemptDecisionParams): RewardClaimAttemptDecision {
  if (status === 'SUCCESS' && hasRewardPayload) {
    return 'reveal'
  }

  if (attempt < maxAttempts) {
    return 'retry'
  }

  return 'fallback'
}

export function hasCompleteRewardPayload(job: RewardPayloadFields): boolean {
  return Boolean(job.nftName && job.nftImage && job.nftRarity && job.nftCategory)
}
