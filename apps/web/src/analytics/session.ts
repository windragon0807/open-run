'use client'

import type { UserInfo } from '@type/user'
import { ANALYTICS_EVENTS, UserIdentifiedProperties } from '@analytics/events'
import { identifyUser, resetAnalyticsUser, trackEvent } from '@analytics/client'

export function identifyAnalyticsUser(userInfo: UserInfo) {
  const properties = getUserIdentifiedProperties(userInfo)

  identifyUser(userInfo.userId, properties)
  trackEvent(ANALYTICS_EVENTS.USER_IDENTIFIED, properties)
}

export function resetAnalyticsSession() {
  resetAnalyticsUser()
}

function getUserIdentifiedProperties(userInfo: UserInfo): UserIdentifiedProperties {
  return {
    provider: userInfo.provider,
    identity_authenticated: userInfo.identityAuthenticated,
    has_profile_image: userInfo.profileImageUrl != null,
  }
}
