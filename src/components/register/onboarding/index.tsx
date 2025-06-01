import clsx from 'clsx'
import Image from 'next/image'
import { useAppStore } from '@store/app'

export default function Onboarding({ nickname }: { nickname: string }) {
  const { isApp } = useAppStore()
  return (
    <section className={clsx('flex flex-col items-center', isApp ? 'pt-174' : 'pt-124')}>
      <p className='text-center text-28'>
        <strong>{nickname}</strong> 님
      </p>
      <p className='mb-40 text-center text-28 font-bold text-primary'>{`지금부터 러닝의\n새로운 재미를 발견해요!`}</p>
      <Image src='/images/img_onboarding.png' alt='Onboarding' width={328} height={328} />
    </section>
  )
}
