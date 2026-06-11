'use client'

import clsx from 'clsx'
import { useState } from 'react'
import LiquidTabBar, { LiquidCenterVisual, LiquidTabItem } from '@components/shared/LiquidTabBar'
import { ExploreIcon } from '@icons/explore'
import { OutlinedFlagIcon } from '@icons/flag'
import { OpenrunIcon } from '@icons/openrun'
import { OutlinedPersonIcon } from '@icons/person'
import { PlusIcon } from '@icons/plus'
import { colors } from '@styles/colors'

const TABS: LiquidTabItem[] = [
  { key: 'home', label: '홈', renderIcon: (color) => <OpenrunIcon size={24} color={color} /> },
  { key: 'explore', label: '탐색', renderIcon: (color) => <ExploreIcon size={24} color={color} /> },
  { key: 'challenges', label: '도전과제', renderIcon: (color) => <OutlinedFlagIcon size={24} color={color} /> },
  { key: 'profile', label: '프로필', renderIcon: (color) => <OutlinedPersonIcon size={24} color={color} /> },
]

/**
 * LiquidTabBar 검증 페이지 (라우팅 없이 로컬 상태로 동작)
 * - 탭 클릭/드래그로 pill 슬라이드, 스크롤로 바 축소/복원 확인
 * - 배경 굴절은 Chromium 전용. Safari/iOS WebView는 blur 프로스트로 자동 폴백.
 */
export default function LiquidGlassTestPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [centerCount, setCenterCount] = useState(0)

  return (
    <div className='relative h-full w-full overflow-hidden'>
      {/* 굴절·축소 확인용 색 대비 큰 스크롤 콘텐츠 */}
      <div className='h-full touch-auto overflow-y-auto pb-[140px]'>
        <div className='flex h-[320px] flex-col justify-end bg-[linear-gradient(135deg,#4A5CEF_0%,#9333EA_50%,#F97316_100%)] p-24'>
          <h1 className='text-32 font-black text-white'>Liquid Glass</h1>
          <p className='text-14 text-white/80'>
            탭 클릭·드래그로 pill 이동, 스크롤로 바 축소를 확인하세요 (+ 클릭 {centerCount}회)
          </p>
        </div>
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className={clsx(
              'mx-16 mt-16 flex h-96 items-center justify-between rounded-16 px-20',
              ['bg-[#22C55E]', 'bg-[#EAB308]', 'bg-[#16181D]', 'bg-[#3B82F6]', 'bg-white shadow-floating-primary'][
                i % 5
              ],
            )}>
            <span className={clsx('text-20 font-bold', i % 5 === 4 ? 'text-black-darken' : 'text-white')}>
              벙 카드 {i + 1}
            </span>
            <span className={clsx('font-jost text-40 font-black', i % 5 === 4 ? 'text-black-darken/20' : 'text-white/40')}>
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>

      <footer className='absolute bottom-0 left-0 right-0 z-40 flex justify-center px-16 pb-24 pt-16'>
        <LiquidTabBar
          items={TABS}
          activeIndex={activeIndex}
          onTabSelect={setActiveIndex}
          onCenterTap={() => setCenterCount((c) => c + 1)}
          centerVisual={
            <LiquidCenterVisual>
              <PlusIcon size={20} color={colors.black.darken} />
            </LiquidCenterVisual>
          }
        />
      </footer>
    </div>
  )
}
