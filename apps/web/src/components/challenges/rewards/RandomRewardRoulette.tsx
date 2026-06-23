'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'

const DEFAULT_REWARD_ROULETTE_IMAGES = [
  '/images/rewards/roulette/body-acc-5.png',
  '/images/rewards/roulette/body-acc-9.png',
  '/images/rewards/roulette/ear-acc-20.png',
  '/images/rewards/roulette/face-32.png',
  '/images/rewards/roulette/face-42.png',
  '/images/rewards/roulette/hair-47.png',
  '/images/rewards/roulette/hair-61.png',
  '/images/rewards/roulette/head-acc-66.png',
  '/images/rewards/roulette/head-acc-68.png',
  '/images/rewards/roulette/pants-73.png',
  '/images/rewards/roulette/pants-95.png',
  '/images/rewards/roulette/shoes-104.png',
  '/images/rewards/roulette/shoes-103.png',
  '/images/rewards/roulette/shoes-116.png',
  '/images/rewards/roulette/skin-127.png',
  '/images/rewards/roulette/top-135.png',
  '/images/rewards/roulette/top-150.png',
  '/images/rewards/roulette/top-149.png',
] as const

const ITEM_SIZE = 56
const ITEM_GAP = 14
const ITEM_STEP = ITEM_SIZE + ITEM_GAP
const VIEWPORT_SIZE = 168
const CENTERED_ITEM_Y = (VIEWPORT_SIZE - ITEM_SIZE) / 2
const REDUCED_MOTION_ROUNDS = 2
const LOOPING_ROUNDS = 3
const SPINNING_ROUNDS = 6
const REVEAL_IMAGE_SIZE = 168
const REVEAL_INITIAL_SCALE = ITEM_SIZE / REVEAL_IMAGE_SIZE
const REVEAL_ANIMATION_DURATION_SECONDS = 0.72
const REVEAL_COMPLETE_DELAY_MS = 120

type RandomRewardRouletteProps = {
  imagePaths?: readonly string[]
  finalIndex?: number
  spinDuration?: number
  loopDuration?: number
  winningImageSrc?: string | null
  onRevealComplete?: () => void
  className?: string
}

type RoulettePhase = 'looping' | 'settling' | 'revealed'

type RouletteRun = {
  imagePaths: string[]
  finalIndex: number
  runId: number
}

export default function RandomRewardRoulette({
  imagePaths,
  finalIndex,
  spinDuration = 3.2,
  loopDuration = 0.9,
  winningImageSrc,
  onRevealComplete,
  className = '',
}: RandomRewardRouletteProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const sourceImages = useMemo(() => createImageSourceList(imagePaths, winningImageSrc), [imagePaths, winningImageSrc])
  const [run, setRun] = useState<RouletteRun>(() => createInitialRouletteRun(sourceImages, finalIndex))
  const [phase, setPhase] = useState<RoulettePhase>('looping')
  const onRevealCompleteRef = useRef(onRevealComplete)
  const isSettling = winningImageSrc != null && winningImageSrc !== ''
  const rounds = shouldReduceMotion ? REDUCED_MOTION_ROUNDS : isSettling ? SPINNING_ROUNDS : LOOPING_ROUNDS
  const targetRound = shouldReduceMotion ? 1 : SPINNING_ROUNDS - 2

  useEffect(() => {
    onRevealCompleteRef.current = onRevealComplete
  }, [onRevealComplete])

  useEffect(() => {
    if (!isSettling) {
      setPhase('looping')
      setRun(createRouletteRun(sourceImages, finalIndex, winningImageSrc))
      return
    }

    setPhase('settling')
    setRun(createRouletteRun(sourceImages, finalIndex, winningImageSrc))

    const settleDurationMs = shouldReduceMotion ? 0 : spinDuration * 1000
    const revealTimerId = window.setTimeout(() => {
      setPhase('revealed')
    }, settleDurationMs)
    const completeTimerId = window.setTimeout(
      () => {
        onRevealCompleteRef.current?.()
      },
      settleDurationMs + REVEAL_ANIMATION_DURATION_SECONDS * 1000 + REVEAL_COMPLETE_DELAY_MS,
    )

    return () => {
      window.clearTimeout(revealTimerId)
      window.clearTimeout(completeTimerId)
    }
  }, [finalIndex, isSettling, shouldReduceMotion, sourceImages, spinDuration, winningImageSrc])

  const reelImages = useMemo(
    () => Array.from({ length: rounds }).flatMap(() => run.imagePaths),
    [rounds, run.imagePaths],
  )

  const loopStartY = CENTERED_ITEM_Y
  const loopTargetY = CENTERED_ITEM_Y - run.imagePaths.length * ITEM_STEP
  const settleStartY = CENTERED_ITEM_Y - run.imagePaths.length * ITEM_STEP
  const settleTargetY = CENTERED_ITEM_Y - (targetRound * run.imagePaths.length + run.finalIndex) * ITEM_STEP
  const startY = isSettling ? settleStartY : loopStartY
  const targetY = isSettling ? settleTargetY : loopTargetY
  const isWinnerRevealed = phase === 'revealed' && winningImageSrc != null && winningImageSrc !== ''

  return (
    <div
      aria-hidden='true'
      className={`w-168 rounded-8 relative aspect-square overflow-hidden transition-[background-color,box-shadow] duration-300 ${
        isWinnerRevealed
          ? 'bg-transparent shadow-none ring-0'
          : 'bg-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.24)] ring-1 ring-white/20'
      } ${className}`}
    >
      <div className='absolute inset-0 [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)] [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)]'>
        <motion.div
          key={run.runId}
          className='flex flex-col items-center gap-14 will-change-transform'
          initial={{ y: shouldReduceMotion ? targetY : startY }}
          animate={{ opacity: isWinnerRevealed ? 0 : 1, y: targetY }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : phase === 'looping' && !isSettling
                ? {
                    duration: loopDuration,
                    ease: 'linear',
                    repeat: Infinity,
                  }
                : {
                    duration: phase === 'settling' ? spinDuration : 0,
                    ease: [0.12, 0.78, 0.16, 1],
                  }
          }
        >
          {reelImages.map((imageSrc, index) => (
            <div
              key={`${imageSrc}-${index}`}
              className='relative flex size-56 shrink-0 items-center justify-center rounded-full bg-white/95 shadow-[0_8px_18px_rgba(0,0,0,0.10)]'
            >
              <Image
                src={imageSrc}
                alt=''
                fill
                sizes='56px'
                className='object-contain p-6'
                unoptimized={winningImageSrc === imageSrc}
              />
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className='rounded-8 pointer-events-none absolute inset-0 bg-white'
        initial={{ opacity: 0.12 }}
        animate={{ opacity: isWinnerRevealed ? 0 : shouldReduceMotion ? 0.08 : [0.12, 0.04, 0.08] }}
        transition={{ duration: shouldReduceMotion ? 0 : isWinnerRevealed ? 0.2 : spinDuration, ease: 'easeOut' }}
      />

      <AnimatePresence>
        {isWinnerRevealed && (
          <motion.div
            className='pointer-events-none absolute inset-0 flex items-center justify-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
          >
            <motion.div
              className='relative flex items-center justify-center'
              style={{ height: REVEAL_IMAGE_SIZE, width: REVEAL_IMAGE_SIZE }}
              initial={{ scale: shouldReduceMotion ? 1 : REVEAL_INITIAL_SCALE, y: 0 }}
              animate={{ scale: shouldReduceMotion ? 1 : [REVEAL_INITIAL_SCALE, 1.04, 1], y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : REVEAL_ANIMATION_DURATION_SECONDS,
                ease: [0.16, 1, 0.3, 1],
                times: [0, 0.78, 1],
              }}
            >
              <Image src={winningImageSrc} alt='' fill sizes='168px' className='object-contain' unoptimized />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function createImageSourceList(
  imagePaths: readonly string[] | undefined,
  winningImageSrc: string | null | undefined,
): string[] {
  const defaultImages = imagePaths && imagePaths.length > 0 ? [...imagePaths] : [...DEFAULT_REWARD_ROULETTE_IMAGES]

  if (winningImageSrc == null || winningImageSrc === '') return defaultImages

  return [winningImageSrc, ...defaultImages.filter((imagePath) => imagePath !== winningImageSrc)]
}

function createInitialRouletteRun(imagePaths: string[], finalIndex: number | undefined): RouletteRun {
  return {
    imagePaths,
    finalIndex: normalizeIndex(finalIndex ?? 0, imagePaths.length),
    runId: 0,
  }
}

function createRouletteRun(
  imagePaths: string[],
  finalIndex: number | undefined,
  winningImageSrc: string | null | undefined,
): RouletteRun {
  const targetSourceIndex =
    winningImageSrc != null && winningImageSrc !== ''
      ? Math.max(imagePaths.indexOf(winningImageSrc), 0)
      : finalIndex == null
        ? getRandomIndex(imagePaths.length)
        : normalizeIndex(finalIndex, imagePaths.length)
  const targetImage = imagePaths[targetSourceIndex]
  const shuffledImages = shuffleImages(imagePaths)

  return {
    imagePaths: shuffledImages,
    finalIndex: Math.max(shuffledImages.indexOf(targetImage), 0),
    runId: Math.random(),
  }
}

function shuffleImages(imagePaths: string[]): string[] {
  const shuffledImages = [...imagePaths]

  for (let index = shuffledImages.length - 1; index > 0; index -= 1) {
    const targetIndex = getRandomIndex(index + 1)
    const currentImage = shuffledImages[index]

    shuffledImages[index] = shuffledImages[targetIndex]
    shuffledImages[targetIndex] = currentImage
  }

  return shuffledImages
}

function normalizeIndex(index: number, length: number): number {
  return ((index % length) + length) % length
}

function getRandomIndex(length: number): number {
  return Math.floor(Math.random() * length)
}
