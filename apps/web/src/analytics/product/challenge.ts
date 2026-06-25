'use client'

import {
  ANALYTICS_EVENTS,
  ChallengeRewardClaimFailedProperties,
  ChallengeRewardClaimProperties,
  ChallengeRewardClaimSucceededProperties,
} from '@analytics/events'
import { trackEvent } from '@analytics/client'

type RewardClaimInput = {
  userChallengeId: number
}

type RewardClaimOutcomeInput = RewardClaimInput & {
  attempts: number
}

type RewardClaimSucceededInput = RewardClaimOutcomeInput & {
  nftCategory: string | null
  nftRarity: string | null
}

export const challengeAnalytics = {
  rewardClaimStarted({ userChallengeId }: RewardClaimInput) {
    trackEvent(ANALYTICS_EVENTS.CHALLENGE_REWARD_CLAIM_STARTED, {
      user_challenge_id: userChallengeId,
    } satisfies ChallengeRewardClaimProperties)
  },

  rewardClaimSucceeded({ userChallengeId, nftCategory, nftRarity, attempts }: RewardClaimSucceededInput) {
    trackEvent(ANALYTICS_EVENTS.CHALLENGE_REWARD_CLAIM_SUCCEEDED, {
      user_challenge_id: userChallengeId,
      nft_category: nftCategory,
      nft_rarity: nftRarity,
      attempts,
    } satisfies ChallengeRewardClaimSucceededProperties)
  },

  rewardClaimFailed({ userChallengeId, attempts }: RewardClaimOutcomeInput) {
    trackEvent(ANALYTICS_EVENTS.CHALLENGE_REWARD_CLAIM_FAILED, {
      user_challenge_id: userChallengeId,
      attempts,
    } satisfies ChallengeRewardClaimFailedProperties)
  },
}
