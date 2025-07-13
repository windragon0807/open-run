'use client'

import clsx from 'clsx'
import { useState } from 'react'
import { useModal } from '@contexts/ModalProvider'
import { useAppStore } from '@store/app'
import { MODAL_KEY } from '@constants/modal'
import AchievementContent from './AchievementContent'
import AchievementTabs from './AchievementTabs'
import RewardModal from './RewardModal'

// 타입을 직접 정의하여 순환 참조 방지
export type AchievementTabType = '전체' | '일반' | '반복' | '이벤트'

/**
 * 도전과제 모달 컴포넌트
 */
export default function Achievement() {
  const { isApp } = useAppStore()
  const [activeTab, setActiveTab] = useState<AchievementTabType>('전체')

  const { showModal } = useModal()
  const handleRewardClick = () => {
    showModal({
      key: MODAL_KEY.REWARD,
      component: <RewardModal />,
    })
  }

  return (
    <article className={clsx('flex h-full w-full flex-col bg-gray-lighten', isApp ? 'pt-72' : 'pt-32')}>
      <h1 className='text-black-default mb-16 pl-16 text-28 font-bold' onClick={handleRewardClick}>
        도전 과제
      </h1>
      <AchievementTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <AchievementContent activeTab={activeTab} />
    </article>
  )
}
