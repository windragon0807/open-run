'use client'

import { useEffect } from 'react'

import Spacing from '@components/shared/Spacing'
import Logo from '@components/shared/icons/Logo'
import KakaoLoginButton from '@components/signin/KakaoLoginButton'
import NaverLoginButton from '@components/signin/NaverLoginButton'
import useOAuth from '@hooks/useOAuth'
import { removeCookie } from '@utils/cookie'
import { COOKIE } from '@constants/cookie'

export default function SignIn() {
  const { kakaoLogin, naverLogin } = useOAuth()

  useEffect(() => {
    removeCookie(COOKIE.ACCESSTOKEN)
  }, [])

  return (
    <div className='w-full h-full bg-primary flex flex-col justify-center items-center'>
      <Logo />
      <Spacing size={80} />

      <KakaoLoginButton onClick={kakaoLogin} />
      <Spacing size={15} />

      <NaverLoginButton onClick={naverLogin} />
    </div>
  )
}
