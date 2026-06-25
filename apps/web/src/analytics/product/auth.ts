'use client'

import {
  ANALYTICS_EVENTS,
  WalletLoginFailedProperties,
  WalletLoginStartedProperties,
  WalletLoginSucceededProperties,
  WalletLoginSurface,
} from '@analytics/events'
import { trackEvent } from '@analytics/client'

export const authAnalytics = {
  walletLoginStarted(surface: WalletLoginSurface) {
    trackEvent(ANALYTICS_EVENTS.WALLET_LOGIN_STARTED, { surface } satisfies WalletLoginStartedProperties)
  },

  walletLoginSucceeded({ hasNickname }: { hasNickname: boolean }) {
    trackEvent(ANALYTICS_EVENTS.WALLET_LOGIN_SUCCEEDED, {
      has_nickname: hasNickname,
    } satisfies WalletLoginSucceededProperties)
  },

  walletLoginFailed(properties?: WalletLoginFailedProperties) {
    trackEvent(ANALYTICS_EVENTS.WALLET_LOGIN_FAILED, properties)
  },
}
