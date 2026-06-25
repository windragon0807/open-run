'use client'

import { useAppStore } from '@store/app'
import { ANALYTICS_EVENTS, ScreenName, ScreenViewedProperties } from '@analytics/events'
import { trackEvent } from '@analytics/client'

export function trackScreenViewed(pathname: string) {
  trackEvent(ANALYTICS_EVENTS.SCREEN_VIEWED, getScreenViewedProperties(pathname))
}

function getScreenViewedProperties(pathname: string): ScreenViewedProperties {
  return {
    $current_url: `${window.location.origin}${pathname}`,
    $pathname: pathname,
    screen: getScreenName(pathname),
    pathname,
    is_app: useAppStore.getState().isApp,
  }
}

function getScreenName(pathname: string): ScreenName {
  if (pathname === '/') return 'home'
  if (pathname === '/signin') return 'signin'
  if (pathname === '/register') return 'register'
  if (pathname === '/explore') return 'explore'
  if (pathname === '/challenges') return 'challenges'
  if (pathname === '/profile') return 'profile'
  if (pathname === '/avatar') return 'avatar'
  if (pathname.startsWith('/bung/')) return 'bung_detail'
  if (pathname.startsWith('/profile/modify-user')) return 'profile_modify_user'
  if (pathname.startsWith('/profile/set-notification')) return 'profile_set_notification'
  if (pathname.startsWith('/notifications')) return 'notifications'

  return 'unknown'
}
