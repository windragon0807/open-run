'use client'

export default function RewardStatus({ progress, total }: { progress: number; total: number }) {
  if (progress < total) {
    return (
      <div className='flex h-40 w-70 items-center justify-center rounded-8 bg-gray-lighten'>
        <span className='text-14 text-gray-darken'>
          <span className='font-bold text-primary'>{progress}</span>/{total}
        </span>
      </div>
    )
  }

  return (
    <button className='h-40 w-70 rounded-8 bg-primary active-press-duration active:scale-98 active:bg-primary-darken'>
      <span className='text-14 font-bold text-white'>보상 받기</span>
    </button>
  )
}
