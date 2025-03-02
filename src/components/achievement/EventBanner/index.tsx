'use client'

import { EventAchievementType } from '@/types/achievement'
import { EventBannerSlider } from './EventBannerSlider'
import { EventBannerList } from './EventBannerList'

// 모든 컴포넌트를 내보내기 - 다른 곳에서 직접 사용할 수 있게 함
export * from './EventBannerItem'
export * from './EventBannerSlider'
export * from './EventBannerList'

/**
 * 이벤트 배너 Props
 */
export interface EventBannerProps {
  /** 이벤트 도전과제 목록 */
  eventAchievements: EventAchievementType[]
  /** 표시 모드 (기본값: slider) */
  mode?: 'slider' | 'list'
}

/**
 * 이벤트 도전과제 배너 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export default function EventBanner({ 
  eventAchievements, 
  mode = 'slider' 
}: EventBannerProps) {
  // 이벤트가 없는 경우 렌더링하지 않음
  if (!eventAchievements.length) return null;

  return (
    <div className="mt-[20px]">
      {mode === 'slider' ? (
        <EventBannerSlider events={eventAchievements} />
      ) : (
        <EventBannerList events={eventAchievements} />
      )}
    </div>
  );
} 