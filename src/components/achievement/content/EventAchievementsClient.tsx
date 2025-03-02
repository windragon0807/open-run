'use client'

import { useEffect } from 'react'
import { useAchievementStore } from '@/store/achievement'
import EventBanner from '../EventBanner'

/**
 * 이벤트 도전과제 클라이언트 컴포넌트
 * 
 * @returns 이벤트 도전과제 클라이언트 컴포넌트
 */
export default function EventAchievementsClient() {
  const { fetchAchievements, eventAchievements, isLoading } = useAchievementStore()

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  if (isLoading) {
    return <div className="flex justify-center p-5">이벤트 도전과제 로딩 중...</div>
  }

  return (
    <div className="flex flex-col items-center p-5 mt-[20px]">
      <div className="max-w-[328px] w-full">
        <EventBanner eventAchievements={eventAchievements} mode="list" />
      </div>
      
      {eventAchievements.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          진행 중인 이벤트 도전과제가 없습니다.
        </div>
      )}
    </div>
  )
} 