'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Rarity } from '@type/avatar'
import type { NftMintJob } from '@apis/v1/nft/mint-jobs'
import { useStartMintJobMutation } from '@apis/v1/nft/mint-jobs/mutation'
import RandomRewardRoulette from './RandomRewardRoulette'
import RewardRevealScreen from './RewardRevealScreen'

const CHALLENGES_PROGRESS_PATH = '/challenges?list=progress'

/* 최초 요청 1회 + 자동 재시도 1회 */
const MAX_ATTEMPTS = 2
const ROULETTE_MIN_LOOP_DURATION_MS = 1400
const ROULETTE_SETTLE_DURATION_SECONDS = 2.4
const PENDING_RETRY_DELAY_MS = 1000

/* failed: 재시도까지 실패 */
type ClaimNotice = 'failed'

const NOTICE_CONTENT: Record<ClaimNotice, { title: string; message: [string, string] }> = {
  failed: {
    title: '발급 실패',
    message: ['보상 발급에 실패했어요.', '잠시 후 다시 시도해 주세요.'],
  },
}

type RewardClaimPageProps = {
  userChallengeId: number
}

export default function RewardClaimPage({ userChallengeId }: RewardClaimPageProps) {
  const router = useRouter()
  const { mutateAsync: startMintJob } = useStartMintJobMutation()
  const [mintJob, setMintJob] = useState<NftMintJob | null>(null)
  const [isRouletteRevealComplete, setIsRouletteRevealComplete] = useState(false)
  const [notice, setNotice] = useState<ClaimNotice | null>(null)
  const startMintJobRef = useRef(startMintJob)
  const mintRequestRef = useRef<{
    userChallengeId: number
    promise: ReturnType<typeof startMintJob>
  } | null>(null)
  const attemptCountRef = useRef(0)

  useEffect(() => {
    startMintJobRef.current = startMintJob
  }, [startMintJob])

  useEffect(() => {
    attemptCountRef.current = 0
    setMintJob(null)
    setIsRouletteRevealComplete(false)
    setNotice(null)

    let isActive = true
    let settleTimerId: number | null = null
    let pendingRetryTimerId: number | null = null
    const requestedAt = Date.now()

    const handleFailure = async () => {
      if (!isActive) return

      if (attemptCountRef.current < MAX_ATTEMPTS) {
        await requestMint()
        return
      }

      setNotice('failed')
    }

    const getMintRequest = () => {
      const currentRequest = mintRequestRef.current

      if (currentRequest?.userChallengeId === userChallengeId) {
        return currentRequest.promise
      }

      const promise = startMintJobRef.current({ userChallengeId })
      const nextRequest = { userChallengeId, promise }
      mintRequestRef.current = nextRequest

      void promise
        .finally(() => {
          if (mintRequestRef.current === nextRequest) {
            mintRequestRef.current = null
          }
        })
        .catch(() => undefined)

      return promise
    }

    const scheduleRouletteSettle = (job: NftMintJob) => {
      const elapsedMs = Date.now() - requestedAt
      const delayMs = Math.max(ROULETTE_MIN_LOOP_DURATION_MS - elapsedMs, 0)

      if (settleTimerId != null) {
        window.clearTimeout(settleTimerId)
      }

      settleTimerId = window.setTimeout(() => {
        if (!isActive) return

        setIsRouletteRevealComplete(false)
        setMintJob(job)
      }, delayMs)
    }

    const schedulePendingRetry = () => {
      if (pendingRetryTimerId != null) {
        window.clearTimeout(pendingRetryTimerId)
      }

      pendingRetryTimerId = window.setTimeout(() => {
        if (!isActive) return
        void requestMint()
      }, PENDING_RETRY_DELAY_MS)
    }

    const requestMint = async () => {
      attemptCountRef.current += 1

      try {
        const response = await getMintRequest()
        if (!isActive) return

        const job = response.data

        if (job.status === 'SUCCESS' && job.nftName && job.nftImage && job.nftRarity && job.nftCategory) {
          scheduleRouletteSettle(job)
          return
        }

        if (job.status === 'FAILED') {
          await handleFailure()
          return
        }

        mintRequestRef.current = null
        schedulePendingRetry()
      } catch {
        if (mintRequestRef.current?.userChallengeId === userChallengeId) {
          mintRequestRef.current = null
        }
        await handleFailure()
      }
    }

    void requestMint()

    return () => {
      isActive = false
      if (settleTimerId != null) {
        window.clearTimeout(settleTimerId)
      }
      if (pendingRetryTimerId != null) {
        window.clearTimeout(pendingRetryTimerId)
      }
    }
  }, [userChallengeId])

  if (mintJob != null && isRouletteRevealComplete) {
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
      <div className='bg-primary absolute inset-0' />
      <div className='absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-b from-transparent to-white' />

      <motion.div
        className='relative flex h-full w-full flex-col items-center'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <h1 className='text-28 mt-[105px] font-bold text-white'>
          {notice != null ? NOTICE_CONTENT[notice].title : '보상 발급 중'}
        </h1>

        <div className='mt-40 flex flex-col items-center'>
          <div className='w-168 relative flex aspect-square items-center justify-center'>
            {notice != null ? (
              <span className='text-14 text-center text-white/80'>
                {NOTICE_CONTENT[notice].message[0]}
                <br />
                {NOTICE_CONTENT[notice].message[1]}
              </span>
            ) : (
              <RandomRewardRoulette
                winningImageSrc={mintJob?.nftImage ?? null}
                spinDuration={ROULETTE_SETTLE_DURATION_SECONDS}
                onRevealComplete={() => setIsRouletteRevealComplete(true)}
              />
            )}
          </div>
        </div>

        {notice != null && (
          <div className='absolute bottom-40 left-16 right-16'>
            <button
              className='rounded-8 active-press-duration active:scale-98 active:bg-gray-lighten flex h-56 w-full items-center justify-center bg-white'
              onClick={() => router.replace(CHALLENGES_PROGRESS_PATH)}
            >
              <span className='text-16 text-black-darken font-bold'>뒤로가기</span>
            </button>
          </div>
        )}
      </motion.div>
    </section>
  )
}
