import Image from 'next/image'
import { Metadata } from 'next'

import Layout from '@shared/Layout'
import SignIn from '@components/signin/Signin'
import Spacing from '@components/shared/Spacing'
import Logo from '@components/icons/Logo'

export default function SignInPage() {
  return (
    <Layout className='bg-gradient-primary-white'>
      <section className='relative w-full h-full flex flex-col items-center bg-gradient-primary-white'>
        <Image
          className='z-0 absolute object-cover'
          src='/images/bg_signin.png'
          priority
          fill
          sizes='(max-width: 768px) 100vw, 33vw'
          alt='배경 이미지'
        />
        <div className='h-[20dvh]' />
        <div className='z-10 flex flex-col text-center items-center'>
          <p className='text-white text-4xl'>당신만의 캐릭터</p>
          <p className='text-white text-4xl font-bold'>함께 달리는 즐거움!</p>
          <Spacing size={32} />
          <Logo />
        </div>
        <SignIn />
      </section>
    </Layout>
  )
}

export const metadata: Metadata = {
  title: '로그인',
  description: "OpenRun, Let's run together!",
}
