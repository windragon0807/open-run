'use client'

import clsx from 'clsx'
import { motion, useReducedMotion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { ListType } from '@type/challenge'
import GlassSurface from '@shared/GlassSurface'
import { OutlinedFlagIcon } from '@icons/flag'
import { colors } from '@styles/colors'

type ListTabProps = {
  selectedTab?: ListType
  onTabChange?: (tab: ListType) => void
}

const CHALLENGE_LIST_TAB_SEGMENTS: Array<{
  type: ListType
  label: string
  width: number
  renderIcon?: (color: string) => ReactNode
}> = [
  {
    type: 'progress',
    label: '진행 중',
    width: 78,
    renderIcon: (color) => <OutlinedFlagIcon size={14} color={color} />,
  },
  {
    type: 'completed',
    label: '완료',
    width: 48,
  },
]

const TAB_HEIGHT = 36
const TAB_RADIUS = TAB_HEIGHT / 2
const TAB_INSET = 3
const ACTIVE_PILL_HEIGHT = TAB_HEIGHT - TAB_INSET * 2
const ACTIVE_PILL_SPRING = { type: 'spring', stiffness: 320, damping: 30 } as const
const GLASS_STYLE = {
  boxShadow:
    'inset 0 0 0 1px rgba(255, 255, 255, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.74), 0 4px 14px rgba(17, 17, 26, 0.08)',
} as const

export default function ListTab({ selectedTab: controlledSelectedTab, onTabChange }: ListTabProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const shouldReduceMotion = useReducedMotion()
  const selectedTab = getSelectedTab(searchParams.get('list'))
  const [optimisticTab, setOptimisticTab] = useState<ListType>(selectedTab)
  const currentTab = controlledSelectedTab ?? optimisticTab

  useEffect(() => {
    setOptimisticTab(selectedTab)
  }, [selectedTab])

  const handleTabSelect = (newTab: ListType) => () => {
    if (newTab === currentTab) {
      return
    }

    const newCategory = newTab === 'progress' ? 'general' : ''

    setOptimisticTab(newTab)
    onTabChange?.(newTab)
    const params = new URLSearchParams(searchParams.toString())
    params.set('list', newTab)
    if (newCategory) {
      params.set('category', newCategory)
    } else {
      params.delete('category')
    }

    router.push(`?${params.toString()}`, { scroll: false })
  }

  const activeSegmentIndex = Math.max(
    0,
    CHALLENGE_LIST_TAB_SEGMENTS.findIndex((segment) => segment.type === currentTab),
  )
  const activeSegment = CHALLENGE_LIST_TAB_SEGMENTS[activeSegmentIndex] ?? CHALLENGE_LIST_TAB_SEGMENTS[0]
  const activePillX = CHALLENGE_LIST_TAB_SEGMENTS.slice(0, activeSegmentIndex).reduce(
    (sum, segment) => sum + segment.width,
    0,
  )
  const trackWidth = CHALLENGE_LIST_TAB_SEGMENTS.reduce((sum, segment) => sum + segment.width, 0) + TAB_INSET * 2

  return (
    <div className='relative h-36' style={{ width: trackWidth }}>
      <GlassSurface
        width='100%'
        height={TAB_HEIGHT}
        borderRadius={TAB_RADIUS}
        borderWidth={0.12}
        backgroundOpacity={0.5}
        distortionScale={-82}
        displace={0.6}
        greenOffset={3}
        blueOffset={6}
        saturation={1.34}
        blur={3}
        style={GLASS_STYLE}>
        <div className='relative flex h-full w-full items-center rounded-full p-3'>
          <div className='pointer-events-none absolute inset-0 rounded-full bg-white/24' />
          <div className='pointer-events-none absolute inset-x-8 top-4 h-6 rounded-full bg-white/45 blur-[1px]' />
          <motion.span
            className='pointer-events-none absolute left-3 top-3 rounded-full bg-black shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_3px_9px_rgba(0,0,0,0.14)]'
            initial={false}
            animate={{
              x: activePillX,
              width: activeSegment.width,
              height: ACTIVE_PILL_HEIGHT,
            }}
            transition={shouldReduceMotion ? { duration: 0 } : ACTIVE_PILL_SPRING}
          />

          {CHALLENGE_LIST_TAB_SEGMENTS.map((segment) => {
            const isActive = currentTab === segment.type
            const contentColor = isActive ? colors.white : colors.gray.darken

            return (
              <button
                key={segment.type}
                type='button'
                aria-pressed={isActive}
                className='relative z-10 flex h-30 items-center justify-center rounded-full text-14 font-bold transition-colors active-press-duration active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'
                style={{ width: segment.width }}
                onClick={handleTabSelect(segment.type)}>
                <span
                  className={clsx('flex items-center justify-center', segment.renderIcon == null ? 'gap-0' : 'gap-3')}
                  style={{ color: contentColor }}>
                  {segment.renderIcon?.(contentColor)}
                  {segment.label}
                </span>
              </button>
            )
          })}
        </div>
      </GlassSurface>
    </div>
  )
}

function getSelectedTab(list: string | null): ListType {
  return list === 'progress' ? 'progress' : 'completed'
}
