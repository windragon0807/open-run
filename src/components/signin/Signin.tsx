'use client'

import Spacing from '@components/shared/Spacing'
import Logo from '@components/shared/icons/Logo'
import KakaoLoginButton from '@components/signin/KakaoLoginButton'
import NaverLoginButton from '@components/signin/NaverLoginButton'
import useOAuth from '@/hooks/useOAuth'

export default function SignIn() {
  const { kakaoLogin, naverLogin } = useOAuth()

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
