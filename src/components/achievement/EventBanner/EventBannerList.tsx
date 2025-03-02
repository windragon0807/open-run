'use client'

import { EventAchievementType } from '@/types/achievement'
import { EventBannerItem } from './EventBannerItem'

/**
 * 이벤트 배너 리스트 Props
 */
export interface EventBannerListProps {
  /** 이벤트 도전과제 목록 */
  eventAchievements: EventAchievementType[]
}

/**
 * 이벤트 배너 리스트 컴포넌트 (이벤트 탭용)
 * 
 * @param props - 컴포넌트 Props
 */
export function EventBannerList({ eventAchievements }: EventBannerListProps) {
  if (eventAchievements.length === 0) {
    return (
      <div className="text-center p-5 text-gray-500">
        진행 중인 이벤트가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-[12px]">
      {eventAchievements.map((event) => (
        <EventBannerItem key={event.id} event={event} />
      ))}
    </div>
  );
} 