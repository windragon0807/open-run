'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Rarity } from '@type/avatar'
import LoadingLogo from '@shared/LoadingLogo'
import type { NftMintJob } from '@apis/v1/nft/mint-jobs'
import { useStartMintJobMutation } from '@apis/v1/nft/mint-jobs/mutation'
import RewardRevealScreen from './RewardRevealScreen'

const CHALLENGES_PROGRESS_PATH = '/challenges?list=progress'

/* 최초 요청 1회 + 자동 재시도 1회 */
const MAX_ATTEMPTS = 2

/* failed: 재시도까지 실패 / pending: 응답은 왔지만 발급이 아직 진행 중(PENDING/MINTING) */
type ClaimNotice = 'failed' | 'pending'

const NOTICE_CONTENT: Record<ClaimNotice, { title: string; message: [string, string] }> = {
  failed: {
    title: '발급 실패',
    message: ['보상 발급에 실패했어요.', '잠시 후 다시 시도해 주세요.'],
  },
  pending: {
    title: '발급 진행 중',
    message: ['보상 발급이 진행 중이에요.', '잠시 후 도전과제 목록에서 확인해 주세요.'],
  },
}

type RewardClaimPageProps = {
  userChallengeId: number
}

export default function RewardClaimPage({ userChallengeId }: RewardClaimPageProps) {
  const router = useRouter()
  const { mutate: startMintJob } = useStartMintJobMutation()
  const [mintJob, setMintJob] = useState<NftMintJob | null>(null)
  const [notice, setNotice] = useState<ClaimNotice | null>(null)
  const attemptCountRef = useRef(0)

  useEffect(() => {
    /* StrictMode 중복 마운트 방지 */
    if (attemptCountRef.current > 0) return

    const handleFailure = () => {
      if (attemptCountRef.current < MAX_ATTEMPTS) {
        requestMint()
        return
      }
      setNotice('failed')
    }

    const requestMint = () => {
      attemptCountRef.current += 1
      startMintJob(
        { userChallengeId },
        {
          onSuccess: (response) => {
            const job = response.data

            if (job.status === 'SUCCESS' && job.nftName && job.nftImage && job.nftRarity && job.nftCategory) {
              setMintJob(job)
              return
            }

            if (job.status === 'FAILED') {
              handleFailure()
              return
            }

            // PENDING/MINTING 등 아직 결과가 없는 상태는 진행 중 안내 화면을 보여준다
            setNotice('pending')
          },
          onError: handleFailure,
        },
      )
    }

    requestMint()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (mintJob != null) {
    return (
      <RewardRevealScreen
        serialNumber={String(mintJob.tokenId ?? '').padStart(5, '0')}
        imageSrc={mintJob.nftImage!}
        rarity={mintJob.nftRarity as Rarity}
        name={mintJob.nftName!}
        category={mintJob.nftCategory!}
        onConfirm={() => router.replace(CHALLENGES_PROGRESS_PATH)}
      />
    )
  }

  return (
    <section className='relative h-full w-full overflow-hidden'>
      {/* RewardRevealScreen과 동일한 배경: 파란색 + 하단 흰색 그라데이션 */}
      <div className='absolute inset-0 bg-primary' />
      <div className='absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-b from-transparent to-white' />

      <motion.div
        className='relative flex h-full w-full flex-col items-center'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}>
        <h1 className='mt-[105px] text-28 font-bold text-white'>
          {notice != null ? NOTICE_CONTENT[notice].title : '보상 발급 중'}
        </h1>

        <div className='mt-40 flex flex-col items-center'>
          <div className='relative flex aspect-square w-168 items-center justify-center'>
            {notice != null ? (
              <span className='text-center text-14 text-white/80'>
                {NOTICE_CONTENT[notice].message[0]}
                <br />
                {NOTICE_CONTENT[notice].message[1]}
              </span>
            ) : (
              <>
                <div className='absolute inset-0 animate-pulse rounded-8 bg-white/20' />
                <LoadingLogo className='w-168' />
              </>
            )}
          </div>
        </div>

        {notice != null && (
          <div className='absolute bottom-40 left-16 right-16'>
            <button
              className='flex h-56 w-full items-center justify-center rounded-8 bg-white active-press-duration active:scale-98 active:bg-gray-lighten'
              onClick={() => router.replace(CHALLENGES_PROGRESS_PATH)}>
              <span className='text-16 font-bold text-black-darken'>뒤로가기</span>
            </button>
          </div>
        )}
      </motion.div>
    </section>
  )
}
