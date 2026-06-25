'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { initAnalytics } from '@analytics/client'
import { resetAnalyticsSession } from '@analytics/session'
import { trackScreenViewed } from '@analytics/screen'

export default function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const lastTrackedPathnameRef = useRef<string | null>(null)

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    if (lastTrackedPathnameRef.current === pathname) return

    lastTrackedPathnameRef.current = pathname
    if (pathname === '/signin') {
      resetAnalyticsSession()
    }

    const timerId = window.setTimeout(() => {
      trackScreenViewed(pathname)
    }, 0)

    return () => window.clearTimeout(timerId)
  }, [pathname])

  return children
}
