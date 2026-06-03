'use client'

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
        <div className='mt-80 text-center text-14 leading-20 text-gray-darken'>아직 알림이 없어요</div>
      </div>
    </section>
  )
}
