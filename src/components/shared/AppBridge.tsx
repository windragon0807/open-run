'use client'

import { ReactNode, useEffect } from 'react'
import { useAppStore } from '@store/app'
import { MESSAGE } from '@constants/app'

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage(message: string): void
    }
  }
}

export type BridgeMessage<T = unknown> = {
  type: MESSAGE
  data: T
}

export default function AppBridge({ children }: { children: ReactNode }) {
  const { setApp } = useAppStore()
  const isApp = checkIsApp()

  /* 앱 여부 설정 */
  useEffect(() => {
    if (!isApp) return
    setApp(isApp)
  }, [isApp])

  /* eruda 초기화 */
  useEffect(() => {
    // if (!isApp) return

    // if (process.env.NODE_ENV === 'development') {
    import('eruda').then((eruda) => {
      eruda.default.init()
    })
    // }
  }, [isApp])

  return children
}

const checkIsApp = () => {
  if (typeof window === 'undefined') return false

  const isReactNativeWebView = !!window.ReactNativeWebView
  const isAndroidWebView = /wv/.test(navigator.userAgent)
  const isIOSWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)

  return isReactNativeWebView || isAndroidWebView || isIOSWebView
}

export const postMessageToRN = (payload: any) => {
  if (typeof window === 'undefined' || !window.ReactNativeWebView) {
    return
  }
  window.ReactNativeWebView.postMessage(JSON.stringify(payload))
}
