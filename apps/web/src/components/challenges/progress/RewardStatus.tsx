'use client'

import { useRouter } from 'next/navigation'
import type { ApiDateTime } from '@utils/api'

type RewardStatusProps = {
  progress: number
  total: number
  userChallengeId: number | null
  completedDate?: ApiDateTime
  nftCompleted?: boolean
}

export default function RewardStatus({
  progress,
  total,
  userChallengeId,
  completedDate,
  nftCompleted = false,
}: RewardStatusProps) {
  const router = useRouter()
  const isCompleted = nftCompleted

  if (progress < total) {
    return (
      <div className='flex h-40 w-70 items-center justify-center rounded-8 bg-gray-lighten'>
        <span className='text-14 text-gray-darken'>
          <span className='font-bold text-primary'>{progress}</span>/{total}
        </span>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className='flex h-40 w-70 items-center justify-center rounded-8 bg-gray-lighten'>
        <span className='text-14 font-bold text-gray-darken'>완료</span>
      </div>
    )
  }

  if (completedDate == null) {
    return (
      <div className='flex h-40 w-70 items-center justify-center rounded-8 bg-gray-lighten'>
        <span className='text-14 text-gray-darken'>
          <span className='font-bold text-primary'>{progress}</span>/{total}
        </span>
      </div>
    )
  }

  if (userChallengeId == null) {
    return (
      <div className='flex h-40 w-70 items-center justify-center rounded-8 bg-gray-lighten'>
        <span className='text-14 text-gray-darken'>대기</span>
      </div>
    )
  }

  return (
    <button
      className='h-40 w-70 rounded-8 bg-primary active-press-duration active:scale-98 active:bg-primary-darken'
      onClick={(event) => {
        event.stopPropagation()
        router.push(`/challenges/reward/${userChallengeId}`)
      }}>
      <span className='text-14 font-bold text-white'>보상 받기</span>
    </button>
  )
}
