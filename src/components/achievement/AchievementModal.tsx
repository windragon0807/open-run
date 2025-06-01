'use client'

import clsx from 'clsx'
import { useState } from 'react'
import { useAppStore } from '@store/app'
import AchievementContent from './AchievementContent'
import AchievementTabs from './AchievementTabs'

// 타입을 직접 정의하여 순환 참조 방지
export type AchievementTabType = '전체' | '일반' | '반복' | '이벤트'

/**
 * 도전과제 모달 컴포넌트
 */
export default function AchievementModal() {
  const { isApp } = useAppStore()
  const [activeTab, setActiveTab] = useState<AchievementTabType>('전체')

  return (
    <article className={clsx('flex h-full w-full flex-col bg-gray-lighten', isApp ? 'pt-72' : 'pt-32')}>
      <h1 className='mb-16 pl-16 text-28 font-bold text-black-default'>도전 과제</h1>
      <AchievementTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <AchievementContent activeTab={activeTab} />
    </article>
  )
}
