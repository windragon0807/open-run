'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { ExploreIcon } from '@icons/explore'
import { OutlinedFlagIcon } from '@icons/flag'
import { OpenrunIcon } from '@icons/openrun'
import { OutlinedPersonIcon } from '@icons/person'
import { PlusIcon } from '@icons/plus'
import { MODAL_KEY } from '@constants/modal'
import { colors } from '@styles/colors'
import { VIBRATION_TYPE } from '@constants/app'
import useAppInsetSize from '@hooks/useAppInsetSize'
import { useVibration } from '@hooks/useVibration'
import CreateBung from '../home/create-bung/CreateBung'
import LiquidTabBar, { LiquidCenterVisual, LiquidTabItem } from './LiquidTabBar'

const TABS: (LiquidTabItem & { href: string; isActive: (pathname: string) => boolean })[] = [
  {
    key: 'home',
    label: '홈',
    href: '/',
    isActive: (pathname) => pathname === '/',
    renderIcon: (color) => <OpenrunIcon size={26} color={color} />,
  },
  {
    key: 'explore',
    label: '탐색',
    href: '/explore',
    isActive: (pathname) => pathname === '/explore',
    renderIcon: (color) => <ExploreIcon size={26} color={color} />,
  },
  {
    key: 'challenges',
    label: '도전과제',
    href: '/challenges?list=progress&category=general',
    isActive: (pathname) => pathname.includes('/challenges'),
    renderIcon: (color) => <OutlinedFlagIcon size={26} color={color} />,
  },
  {
    key: 'profile',
    label: '프로필',
    href: '/profile',
    isActive: (pathname) => pathname === '/profile',
    renderIcon: (color) => <OutlinedPersonIcon size={26} color={color} />,
  },
]

/**
 * Liquid glass 바텀 네비게이션 (인스타그램식 슬라이딩 pill + 드래그 선택 + 스크롤 축소).
 * 배경 굴절은 Chromium(Chrome/Android WebView) 전용이고,
 * Safari/iOS WebView는 GlassSurface가 blur 프로스트 글래스로 자동 폴백한다.
 */
export default function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const vibrate = useVibration()
  const { showModal } = useModal()
  const paddingBottom = useAppInsetSize('bottom', 24)

  const activeIndex = TABS.findIndex((tab) => tab.isActive(pathname))

  // Link 대신 pointer 제스처로 이동하므로 프리페치는 직접 건다
  useEffect(() => {
    TABS.forEach((tab) => router.prefetch(tab.href))
  }, [router])

  return (
    <footer
      className='fixed bottom-0 left-0 right-0 z-[999] flex justify-center px-16 pb-24 pt-16'
      style={{ paddingBottom }}>
      <LiquidTabBar
        items={TABS}
        activeIndex={activeIndex}
        onTabSelect={(index) => {
          vibrate(VIBRATION_TYPE.SELECTION)
          router.push(TABS[index].href)
        }}
        onSnap={() => vibrate(VIBRATION_TYPE.SELECTION)}
        onCenterTap={() => {
          vibrate(VIBRATION_TYPE.IMPACT_MEDIUM)
          showModal({ key: MODAL_KEY.CREATE_BUNG, component: <CreateBung /> })
        }}
        centerLabel='벙 만들기'
        centerVisual={
          <LiquidCenterVisual>
            <PlusIcon size={21} color={colors.black.darken} />
          </LiquidCenterVisual>
        }
      />
    </footer>
  )
}
