'use client'

import { useEffect, useRef } from 'react'
import type { UserInfo } from '@type/user'
import { identifyAnalyticsUser } from '@analytics/session'

export default function useIdentifyAnalyticsUser(userInfo: UserInfo | null) {
  const identifiedUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (userInfo?.userId == null) return
    if (identifiedUserIdRef.current === userInfo.userId) return

    identifiedUserIdRef.current = userInfo.userId
    identifyAnalyticsUser(userInfo)
  }, [userInfo])
}
