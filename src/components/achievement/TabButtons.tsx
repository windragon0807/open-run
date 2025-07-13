'use client'

import clsx from 'clsx'
import { useCallback } from 'react'
import { AchievementTabType } from './index'

/**
 * 탭 버튼 컴포넌트 Props
 */
interface TabButtonsProps {
  /** 현재 선택된 탭 */
  activeTab: AchievementTabType
}

/**
 * 탭 버튼 컴포넌트
 *
 * @param props - 컴포넌트 Props
 */
export function TabButtons({ activeTab }: TabButtonsProps) {
  // 탭 변경 처리
  const handleTabChange = useCallback((tab: AchievementTabType) => {
    // 커스텀 이벤트 발생
    const event = new CustomEvent('achievementTabChange', {
      detail: { tab },
    })
    window.dispatchEvent(event)
  }, [])

  return (
    <div className='mx-auto flex h-[36px] w-full justify-center px-16'>
      {(['전체', '일반', '반복', '이벤트'] as const).map((tab) => (
        <TabButton key={tab} isActive={activeTab === tab} onClick={() => handleTabChange(tab)}>
          {tab}
        </TabButton>
      ))}
    </div>
  )
}

function TabButton({
  isActive,
  children,
  onClick,
}: {
  isActive: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      className={clsx(
        'h-full flex-1 text-center',
        isActive ? 'rounded-tl-[10px] rounded-tr-[10px] bg-black-darken text-white' : 'bg-gray-lighten text-[#89939D]',
      )}
      onClick={onClick}
      data-tab-id='전체'>
      {children}
    </button>
  )
}
