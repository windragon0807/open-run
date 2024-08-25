'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'
import { setCookie } from '@utils/cookie'
import { COOKIE } from '@constants/cookie'

/**
 * 서버 컴포넌트에서는 부수 효과(side effects)를 도입할 수 없기 때문에, 동일한 입력에 대해 일관된 출력을 보장해야 합니다.
 * 그러나 쿠키 설정은 부수 효과로 간주되며, 서버 컴포넌트에서는 직접적으로 이를 수행할 수 없습니다.
 * 따라서, 쿠키 설정의 경우 클라이언트 컴포넌트에서 필요에 따라 수행하는 것으로 대체합니다.
 */
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
