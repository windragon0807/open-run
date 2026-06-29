'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@store/app'
import { MESSAGE, type AppStatusBarStyle } from '@constants/app'
import { postMessageToRN } from './AppBridge'

const DEFAULT_STATUS_BAR_STYLE: AppStatusBarStyle = 'dark'

export default function AppStatusBarController() {
  const pathname = usePathname()
  const statusBarOverride = useAppStore((state) => state.statusBarOverride)
  const style =
    statusBarOverride?.pathname === pathname ? statusBarOverride.style : getRouteStatusBarStyle(pathname)

  useEffect(() => {
    postMessageToRN({
      type: MESSAGE.SET_STATUS_BAR_STYLE,
      data: { style },
    })
  }, [style])

  return null
}

function getRouteStatusBarStyle(pathname: string): AppStatusBarStyle {
  if (pathname === '/signin' || pathname === '/register') {
    return 'light'
  }

  if (pathname === '/privacy' || pathname === '/support') {
    return 'light'
  }

  if (/^\/challenges\/reward\/[^/]+$/.test(pathname)) {
    return 'light'
  }

  if (/^\/bung\/[^/]+$/.test(pathname)) {
    return 'light'
  }

  return DEFAULT_STATUS_BAR_STYLE
}
