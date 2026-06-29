'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { resetAnalyticsSession, useIdentifyAnalyticsUser } from '@analytics'
import { useUserInfo } from '@apis/v1/users/query'
import { COOKIE } from '@constants/cookie'
import { removeCookie } from '@utils/cookie'
import { logoutSession } from '@openrun/api-client/auth'
import LoadingLogo from './LoadingLogo'

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { userInfo, isError, isSuccess } = useUserInfo()
  useIdentifyAnalyticsUser(userInfo)

  // /v1/users가 refresh/retry 후에도 실패하면 무한 LoadingLogo에 갇히지 않도록 세션을 정리한다.
  useEffect(() => {
    if (isError) {
      void logoutSession()
      removeCookie(COOKIE.ACCESSTOKEN)
      resetAnalyticsSession()
      router.replace('/signin')
    }
  }, [isError, router])

  useEffect(() => {
    if (isSuccess && userInfo?.nickname == null) {
      router.replace('/signin')
    }
  }, [isSuccess, router, userInfo?.nickname])

  // 인증은 access token refresh와 백엔드 user 정보로 충분하다.
  // Reown wallet 상태는 더 이상 게이트에 영향을 주지 않는다 — wallet은 로그인/로그아웃 시점에만 사용된다.
  if (userInfo?.nickname == null) {
    return (
      <div className='flex h-full w-full items-center justify-center bg-gradient-primary-white'>
        <LoadingLogo className='text-white' />
      </div>
    )
  }

  return children
}
