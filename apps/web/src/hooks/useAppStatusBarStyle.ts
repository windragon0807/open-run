'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@store/app'
import type { AppStatusBarStyle } from '@constants/app'

export default function useAppStatusBarStyle(
  style: AppStatusBarStyle,
  { enabled = true, pathname: targetPathname }: { enabled?: boolean; pathname?: string } = {},
) {
  const pathname = usePathname()
  const setStatusBarOverride = useAppStore((state) => state.setStatusBarOverride)
  const clearStatusBarOverride = useAppStore((state) => state.clearStatusBarOverride)

  useEffect(() => {
    const isEnabled = enabled && (targetPathname == null || targetPathname === pathname)
    if (!isEnabled) {
      return
    }

    setStatusBarOverride({ pathname, style })

    return () => {
      clearStatusBarOverride(pathname)
    }
  }, [clearStatusBarOverride, enabled, pathname, setStatusBarOverride, style, targetPathname])
}
