'use client'

import { useEffect } from 'react'

import { removeCookie } from '@utils/cookie'
import useOAuth from '@hooks/useOAuth'
import { COOKIE } from '@constants/cookie'
import NaverLoginButton from '@components/signin/NaverLoginButton'
import KakaoLoginButton from '@components/signin/KakaoLoginButton'
import Spacing from '@components/shared/Spacing'

export default function SignIn() {
  const { kakaoLogin, naverLogin } = useOAuth()

  useEffect(() => {
    removeCookie(COOKIE.ACCESSTOKEN)
  }, [])

  return (
    <div className='absolute bottom-40 w-full px-16'>
      <KakaoLoginButton onClick={kakaoLogin} />
      <Spacing size={15} />
      <NaverLoginButton onClick={naverLogin} />
    </div>
  )
}
