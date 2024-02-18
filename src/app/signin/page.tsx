import { Metadata } from 'next'
import Link from 'next/link'

import Spacing from '@/components/shared/Spacing'
import Logo from '@/components/shared/icons/Logo'
import KakaoLoginButton from '@/components/signin/KakaoLoginButton'
import NaverLoginButton from '@/components/signin/NaverLoginButton'

export const metadata: Metadata = {
  title: 'OpenRun | Sign In',
  description: "OpenRun, Let's run together!",
}

export default function SignIn() {
  return (
    <main className="w-full h-full bg-primary flex flex-col justify-center items-center">
      <Logo />

      <Spacing size={35} />

      <Link href="/register">
        <KakaoLoginButton />
      </Link>

      <Spacing size={10} />

      <Link href="/register">
        <NaverLoginButton />
      </Link>
    </main>
  )
}
