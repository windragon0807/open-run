'use client'

import { useMintStore } from '@store/mint'

type RewardStatusProps = {
  progress: number
  total: number
  challengeId: number
}

export default function RewardStatus({ progress, total, challengeId }: RewardStatusProps) {
  const startMint = useMintStore((state) => state.startMint)
  const status = useMintStore((state) => state.status)

  const isPending = status === 'pending'

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
    <button
      className='h-40 w-70 rounded-8 bg-primary active-press-duration active:scale-98 active:bg-primary-darken disabled:bg-gray'
      disabled={isPending}
      onClick={() => startMint(challengeId)}>
      <span className='text-14 font-bold text-white'>{isPending ? '발급 중' : '보상 받기'}</span>
    </button>
  )
}
