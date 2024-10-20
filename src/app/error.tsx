'use client'

import { HiHome } from 'react-icons/hi'
import { IoWarning } from 'react-icons/io5'
import { MdOutlineRefresh } from 'react-icons/md'
import Link from 'next/link'

type Props = {
  error: Error
  reset: () => void
}

export default function ErrorPage({ error, reset }: Props) {
  return (
    <section className='w-dvw h-dvh flex flex-col justify-center items-center bg-primary'>
      <IoWarning className='mb-20' size={80} color='var(--secondary)' />
      <h2 className='text-2xl font-bold text-white mb-10'>앗! 문제가 발생했어요</h2>
      <p className='text-lg text-white mb-40'>잠시 후 다시 시도해 주세요.</p>
      <button
        className='px-20 py-10 bg-white text-primary rounded-4 flex justify-center items-center gap-8 font-[500] mb-15'
        onClick={reset}>
        <MdOutlineRefresh size={18} />
        다시 시도하기
      </button>
      <Link
        className='px-20 py-10 bg-white text-primary rounded-4 flex justify-center items-center gap-8 font-[500]'
        href='/'>
        <HiHome size={18} />
        홈으로 돌아가기
      </Link>
    </section>
  )
}
