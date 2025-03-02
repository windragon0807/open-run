'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAchievementStore } from '@/store/achievement'
import AchievementHeader from './AchievementHeader'
import AchievementTabs, { AchievementTabType } from './AchievementTabs'
import AchievementContent from './AchievementContent'

/**
 * 도전과제 모달 컴포넌트
 * 사용자가 달성할 수 있는 도전과제 목록을 보여주고 관리하는 컴포넌트
 */
export default function AchievementModal() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<AchievementTabType>('전체')
  const { 
    regularAchievements, 
    repeatAchievements, 
    eventAchievements, 
    fetchAchievements, 
    isLoading 
  } = useAchievementStore()

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  /**
   * 모달 닫기 핸들러
   */
  const handleClose = () => {
    router.back()
  }

  /**
   * 탭 변경 핸들러
   * 
   * @param tab - 선택된 탭
   */
  const handleTabChange = (tab: AchievementTabType) => {
    setActiveTab(tab)
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col">
        <AchievementHeader onClose={handleClose} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* 헤더 컴포넌트 */}
      <AchievementHeader onClose={handleClose} />
      
      {/* 카테고리 탭 컴포넌트 */}
      <AchievementTabs 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      
      {/* 콘텐츠 영역 컴포넌트 */}
      <AchievementContent 
        activeTab={activeTab}
        regularAchievements={regularAchievements} 
        repeatAchievements={repeatAchievements} 
        eventAchievements={eventAchievements} 
      />
    </div>
  )
} 