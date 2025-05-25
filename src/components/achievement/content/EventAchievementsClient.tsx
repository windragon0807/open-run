'use client'

import { useAchievementStore } from '@/store/achievement'
import { useEffect } from 'react'
import { EventBannerList } from '../EventBanner/EventBannerList'

/**
 * 이벤트 도전과제 클라이언트 컴포넌트
 * 이벤트 탭에서 사용되는 세로 리스트 형태의 이벤트 배너들을 표시합니다.
 */
export default function EventAchievementsClient() {
  const { eventAchievements, fetchAchievements, isLoading } = useAchievementStore()

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  /**
   * 이벤트 클릭 핸들러
   */
  const handleEventClick = (event: any) => {
    console.log('이벤트 클릭:', event)
    // 여기에 이벤트 클릭 시 처리 로직 추가
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-[60px]'>
        <div className='text-[14px] font-medium text-[#999999]'>이벤트를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className='w-full'>
      <EventBannerList eventAchievements={eventAchievements} onEventClick={handleEventClick} />
    </div>
  )
}
