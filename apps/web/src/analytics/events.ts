export const ANALYTICS_EVENTS = {
  SCREEN_VIEWED: '$pageview',
  USER_IDENTIFIED: 'user_identified',
  WALLET_LOGIN_STARTED: 'wallet_login_started',
  WALLET_LOGIN_SUCCEEDED: 'wallet_login_succeeded',
  WALLET_LOGIN_FAILED: 'wallet_login_failed',
  BUNG_CARD_CLICKED: 'bung_card_clicked',
  CREATE_BUNG_STARTED: 'create_bung_started',
  BUNG_CREATED: 'bung_created',
  BUNG_CREATE_FAILED: 'bung_create_failed',
  BUNG_JOIN_CLICKED: 'bung_join_clicked',
  BUNG_JOIN_SUCCEEDED: 'bung_join_succeeded',
  BUNG_JOIN_FAILED: 'bung_join_failed',
  BUNG_COMPLETED: 'bung_completed',
  AVATAR_SAVED: 'avatar_saved',
  AVATAR_SAVE_FAILED: 'avatar_save_failed',
  CHALLENGE_REWARD_CLAIM_STARTED: 'challenge_reward_claim_started',
  CHALLENGE_REWARD_CLAIM_SUCCEEDED: 'challenge_reward_claim_succeeded',
  CHALLENGE_REWARD_CLAIM_FAILED: 'challenge_reward_claim_failed',
  PROFILE_FEEDBACK_CLICKED: 'profile_feedback_clicked',
} as const

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]

export type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>

export type ScreenName =
  | 'home'
  | 'signin'
  | 'register'
  | 'explore'
  | 'challenges'
  | 'profile'
  | 'avatar'
  | 'bung_detail'
  | 'profile_modify_user'
  | 'profile_set_notification'
  | 'notifications'
  | 'unknown'

export type ScreenViewedProperties = {
  $current_url: string
  $pathname: string
  screen: ScreenName
  pathname: string
  is_app: boolean
}

export type UserIdentifiedProperties = {
  provider: string
  identity_authenticated: boolean
  has_profile_image: boolean
}

export type WalletLoginSurface = 'app' | 'browser'

export type WalletLoginStartedProperties = {
  surface: WalletLoginSurface
}

export type WalletLoginSucceededProperties = {
  has_nickname: boolean
}

export type WalletLoginFailedProperties = {
  surface?: WalletLoginSurface
  reason?: string
}

export type BungCardClickedProperties = {
  bung_id: string | number
  source: 'my_bungs' | 'recommendation'
  position: number
  is_owner?: boolean
  remaining_count?: number
}

export type BungCreatedProperties = {
  distance: number
  member_number: number
  has_after_run: boolean
  hashtag_count: number
}

export type BungIdProperties = {
  bung_id: string | number
}

export type BungCompletedProperties = BungIdProperties & {
  member_count: number
}

export type AvatarSavedProperties = {
  equipped_slot_count: number
}

export type ChallengeRewardClaimProperties = {
  user_challenge_id: number
}

export type ChallengeRewardClaimFailedProperties = ChallengeRewardClaimProperties & {
  attempts: number
}

export type ChallengeRewardClaimSucceededProperties = ChallengeRewardClaimFailedProperties & {
  nft_category: string | null
  nft_rarity: string | null
}

export type ProfileFeedbackClickedProperties = BungIdProperties
