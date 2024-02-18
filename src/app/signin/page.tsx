import Spacing from '@/components/shared/Spacing'
import Logo from '@/components/shared/icons/Logo'
import KakaoLoginButton from '@/components/signin/KakaoLoginButton'
import NaverLoginButton from '@/components/signin/NaverLoginButton'

export default function SignIn() {
  return (
    <main className="w-full h-full bg-primary flex flex-col justify-center items-center">
      <Logo />
      <Spacing size={35} />
      <KakaoLoginButton />
      <Spacing size={10} />
      <NaverLoginButton />
    </main>
  )
}
