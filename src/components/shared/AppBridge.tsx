'use client'

import { ReactNode, useEffect } from 'react'

import { useAppMessage } from '@store/app'
import { Message } from '@/types/app'
import { MESSAGE } from '@constants/app'

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage(message: string): void
    }
  }
}

export default function AppBridge({ children }: { children: ReactNode }) {
  const { setApp, setMessage } = useAppMessage()
  const isApp = checkIsApp()

  useEffect(() => {
    if (!isApp) return

    setApp(isApp)
    postMessageToRN({ type: MESSAGE.WEBVIEW_READY, payload: {} })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isApp) return

    const onMessageHandler = (event: MessageEvent) => {
      console.log('메시지 수신:', event.data)
      try {
        const parsedMessage = JSON.parse(event.data) as Message
        setMessage(parsedMessage)

        if (parsedMessage.statusBarHeight != null) {
          postMessageToRN({ type: MESSAGE.RENDER_READY, payload: {} })
        }
      } catch (error) {
        console.error('메시지 파싱 오류:', error)
      }
    }

    // iOS와 Android 모두 지원하기 위해 window와 document에 이벤트 리스너 추가
    window.addEventListener('message', onMessageHandler as EventListener)
    document.addEventListener('message', onMessageHandler as EventListener)

    return () => {
      window.removeEventListener('message', onMessageHandler as EventListener)
      document.removeEventListener('message', onMessageHandler as EventListener)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return children
}

// Web에서 App으로 메시지 보내는 함수
export const postMessageToRN = (payload: any) => {
  if (typeof window === 'undefined' || !window.ReactNativeWebView) {
    return
  }
  window.ReactNativeWebView.postMessage(JSON.stringify(payload))
}

const checkIsApp = () => {
  const isReactNativeWebView = !!window.ReactNativeWebView
  const isAndroidWebView = /wv/.test(navigator.userAgent)
  const isIOSWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)

  return isReactNativeWebView || isAndroidWebView || isIOSWebView
}
