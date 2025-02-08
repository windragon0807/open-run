'use client'

import WarningIcon from '@icons/WarningIcon'

export default function Error({ type }: { type: 'small' | 'medium' | 'large' }) {
  if (type === 'small') {
    return (
      <div className='size-full flex items-center gap-4'>
        <p className='text-lg font-semibold text-[#D7D6DE]'>정보를 불러오지 못했어요</p>
        <WarningIcon className='-translate-y-2' size={24} />
      </div>
    )
  }

  if (type === 'medium') {
    return (
      <div className='size-full flex flex-col items-center justify-center gap-10'>
        <WarningIcon size={60} />
        <p className='text-xl font-bold text-[#D7D6DE]'>정보를 불러오지 못했어요</p>
      </div>
    )
  }

  if (type === 'large') {
    return (
      <div className='size-full flex flex-col items-center justify-center'>
        <WarningIcon className='mb-10' size={60} />
        <p className='text-xl font-bold text-[#D7D6DE] mb-25'>정보를 불러오지 못했어요</p>
        <button
          className='px-28 py-6 border border-[#D7D6DE] rounded-20 text-base font-semibold'
          onClick={() => window.location.reload()}>
          재시도
        </button>
      </div>
    )
  }

  return null
}
