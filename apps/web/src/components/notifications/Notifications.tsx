'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@icons/arrow'
import { colors } from '@styles/colors'

export default function Notifications() {
  const router = useRouter()

  return (
    <section className='h-full w-full bg-white'>
      <header className='relative flex h-60 items-center justify-center px-16 app:mt-50'>
        <button
          className='absolute left-12 rounded-8 p-4 active-press-duration active:scale-90 active:bg-gray/50'
          onClick={() => router.back()}>
          <ArrowLeftIcon size={24} color={colors.black.DEFAULT} />
        </button>
        <h1 className='text-16 font-bold'>알림</h1>
      </header>

      <div className='h-[calc(100%-60px)] overflow-y-auto px-16 pb-120'>
        <div className='flex h-full w-full flex-col items-center justify-center gap-8'>
          <Image src='/images/home/skewed_x_button.png' alt='기울어진 X 버튼 이미지' width={56} height={56} />
          <p className='text-center text-14 leading-20 text-gray-darken'>
            아직 알림이 없어요 <br />
            새로운 알림이 오면 여기서 확인할 수 있어요!
          </p>
        </div>
      </div>
    </section>
  )
}
