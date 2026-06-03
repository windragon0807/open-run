'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStartMintJobMutation } from '@apis/v1/nft/mint-jobs/mutation'
import { MODAL_KEY } from '@constants/modal'
import { useModal } from '@contexts/ModalProvider'
import { Rarity } from '@type/avatar'
import RewardsModal from '../rewards/RewardsModal'

type RewardStatusProps = {
  progress: number
  total: number
  userChallengeId: number | null
  nftCompleted?: boolean
}

export default function RewardStatus({
  progress,
  total,
  userChallengeId,
  nftCompleted = false,
}: RewardStatusProps) {
  const router = useRouter()
  const { showModal } = useModal()
  const [lastFailedUserChallengeId, setLastFailedUserChallengeId] = useState<number | null>(null)
  const { mutate: startMintJob, isPending, variables } = useStartMintJobMutation()
  const isStarting = isPending && variables?.userChallengeId === userChallengeId
  const isFailed = lastFailedUserChallengeId === userChallengeId
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

  if (userChallengeId == null) {
    return (
      <div className='flex h-40 w-70 items-center justify-center rounded-8 bg-gray-lighten'>
        <span className='text-14 text-gray-darken'>대기</span>
      </div>
    )
  }

  return (
    <button
      className='h-40 w-70 rounded-8 bg-primary active-press-duration active:scale-98 active:bg-primary-darken disabled:bg-gray'
      disabled={isStarting}
      onClick={(event) => {
        event.stopPropagation()
        startMintJob(
          { userChallengeId },
          {
            onSuccess: (response) => {
              const mintJob = response.data

              if (mintJob.status === 'FAILED') {
                setLastFailedUserChallengeId(userChallengeId)
                router.refresh()
                return
              }

              setLastFailedUserChallengeId(null)
              router.refresh()

              if (
                mintJob.status !== 'SUCCESS' ||
                !mintJob.nftName ||
                !mintJob.nftImage ||
                !mintJob.nftRarity ||
                !mintJob.nftCategory
              ) {
                return
              }

              showModal({
                key: MODAL_KEY.REWARD,
                component: (
                  <RewardsModal
                    serialNumber={String(mintJob.tokenId ?? '').padStart(5, '0')}
                    imageSrc={mintJob.nftImage}
                    rarity={mintJob.nftRarity as Rarity}
                    name={mintJob.nftName}
                    category={mintJob.nftCategory}
                  />
                ),
              })
            },
          },
        )
      }}>
      <span className='text-14 font-bold text-white'>{isStarting ? '발급 중' : isFailed ? '재시도' : '보상 받기'}</span>
    </button>
  )
}
