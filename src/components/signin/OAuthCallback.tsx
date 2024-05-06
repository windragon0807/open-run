'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { setCookie } from '@utils/cookie'
import { COOKIE } from '@constants/cookie'

export default function OAuthCallback({ nickname, jwtToken }: { nickname: string | null; jwtToken: string }) {
  const router = useRouter()

  useEffect(() => {
    setCookie(COOKIE.ACCESSTOKEN, jwtToken)

    if (nickname != null) {
      /* 이미 가입이 완료된 유저 */
      router.replace('/')
    } else {
      /* 가입이 되지 않은 유저 */
      router.replace('/register')
    }
  }, [jwtToken, nickname, router])

  return null
}
