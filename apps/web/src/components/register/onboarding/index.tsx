'use client'

import Image from 'next/image'
import useAppInsetSize from '@hooks/useAppInsetSize'

export default function Onboarding({ nickname }: { nickname: string }) {
  const topPadding = useAppInsetSize('top', 124)

  return (
    <section className='flex flex-col items-center pt-124' style={{ paddingTop: topPadding }}>
      <p className='text-center text-28'>
        <strong>{nickname}</strong> 님
      </p>
      <p className='mb-40 text-center text-28 font-bold text-primary'>{`지금부터 러닝의\n새로운 재미를 발견해요!`}</p>
      <Image src='/images/img_onboarding.png' alt='Onboarding' width={328} height={328} />
    </section>
  )
}
