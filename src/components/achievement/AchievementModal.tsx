'use client'

import { useEffect, useState } from 'react'
import { useAchievementStore } from '@store/achievement'
import AchievementHeader from './AchievementHeader'
import AchievementTabs from './AchievementTabs'
import AchievementContent from './AchievementContent'

// 타입을 직접 정의하여 순환 참조 방지
export type AchievementTabType = '전체' | '일반' | '반복' | '이벤트'

/**
 * 도전과제 모달 컴포넌트
 */
export default function AchievementModal() {
  const [activeTab, setActiveTab] = useState<AchievementTabType>('전체')
  const { 
    fetchAchievements, 
    isLoading, 
    regularAchievements, 
    repeatAchievements, 
    eventAchievements 
  } = useAchievementStore()

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  // 페이지 닫기 핸들러
  const handleClose = () => {
    window.history.back()
  }

  return (
    <article className="flex flex-col h-full w-full">
      {/* 헤더 - 배경색 #F8F9FA */}
      <div className="bg-[#F8F9FA]">
        <AchievementHeader onClose={handleClose} />
      </div>
      
      {/* 탭 - 배경색 #F8F9FA */}
      <div className="bg-[#F8F9FA]">
        <AchievementTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      {/* 컨텐츠 - 배경색 #FFFFFF */}
      <div className="flex-1 overflow-auto bg-[#FFFFFF]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <p>로딩 중...</p>
          </div>
        ) : (
          <AchievementContent 
            activeTab={activeTab} 
            regularAchievements={regularAchievements}
            repeatAchievements={repeatAchievements}
            eventAchievements={eventAchievements}
          />
        )}
      </div>
    </article>
  )
} 