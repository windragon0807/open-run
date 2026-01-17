'use client'

import { ReactNode, useEffect } from 'react'
import { WalletProvider } from '@contexts/WalletProvider'
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
  const { setIsApp, setInsets } = useAppStore()
  const isApp = checkIsApp()

  /* 앱 여부 설정 */
  useEffect(() => {
    setIsApp(isApp)

    // 앱 환경일 때 body에 app 클래스 추가
    if (isApp) {
      document.body.classList.add('app')
    } else {
      document.body.classList.remove('app')
    }

    if (process.env.NODE_ENV === 'development') {
      import('eruda').then((eruda) => {
        eruda.default.init()
      })
    }
  }, [isApp, setIsApp])

  /* 앱에서 전달되는 메시지 처리 (inset 값 등) */
  useEffect(() => {
    if (!isApp) return

    const handleMessage = (event: MessageEvent) => {
      try {
        const parsedMessage = JSON.parse(event.data) as BridgeMessage
        if (parsedMessage.type === MESSAGE.INSET) {
          const insetData = parsedMessage.data as { top: number; bottom: number }
          console.log('📱 [AppBridge] Received inset values from native app:', insetData)
          setInsets(insetData)
        }
      } catch (error) {
        // 메시지 파싱 실패는 무시 (다른 메시지일 수 있음)
      }
    }

    // iOS와 Android 모두 지원하기 위해 window와 document에 이벤트 리스너 추가
    window.addEventListener('message', handleMessage as EventListener)
    document.addEventListener('message', handleMessage as EventListener)

    return () => {
      window.removeEventListener('message', handleMessage as EventListener)
      document.removeEventListener('message', handleMessage as EventListener)
    }
  }, [isApp, setInsets])

  return children
}

export const checkIsApp = () => {
  if (typeof window === 'undefined') return false

  const isReactNativeWebView = !!window.ReactNativeWebView
  const isAndroidWebView = /wv/.test(navigator.userAgent)
  const isIOSWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)

  return isReactNativeWebView || isAndroidWebView || isIOSWebView
}

export const postMessageToRN = (payload: any) => {
  if (typeof window === 'undefined' || !window.ReactNativeWebView) {
    console.log('⚠️ [Web] Cannot send message - not in app environment')
    return
  }
  const messageString = JSON.stringify(payload)
  console.log('📤 [Web] Sending message to React Native:', payload)
  console.log('📤 [Web] Message string:', messageString)
  window.ReactNativeWebView.postMessage(messageString)
}
