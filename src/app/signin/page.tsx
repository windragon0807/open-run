import Image from 'next/image'
import { Metadata } from 'next'

import SignIn from '@components/signin/Signin'
import Logo from '@components/icons/Logo'
import Spacing from '@components/shared/Spacing'

export default function SignInPage() {
  return (
    <div
      className='relative w-full h-full bg-primary flex flex-col items-center'
      style={{ backgroundImage: 'linear-gradient(to bottom, #4A5CEF 50%, #FFF)' }}>
      <Image className='z-0 absolute' src='/images/bg_signin.png' layout='fill' priority alt='배경 이미지' />
      <div className='h-[20dvh]'></div>
      <div className='z-10 flex flex-col text-center items-center'>
        <p className='text-white text-4xl'>당신만의 캐릭터</p>
        <p className='text-white text-4xl font-bold'>함께 달리는 즐거움!</p>
        <Spacing size={32} />
        <Logo />
      </div>
      <SignIn />
    </div>
  )
}

export const metadata: Metadata = {
  title: 'OpenRun | Sign In',
  description: "OpenRun, Let's run together!",
}
