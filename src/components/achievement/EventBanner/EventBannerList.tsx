'use client'

import { EventAchievementType } from '@/types/achievement'
import { EventBannerItem } from './EventBannerItem'

/**
 * 이벤트 배너 리스트 Props
 */
export interface EventBannerListProps {
  /** 이벤트 도전과제 목록 */
  events: EventAchievementType[]
}

/**
 * 이벤트 배너 리스트 컴포넌트 (이벤트 탭용)
 * 
 * @param props - 컴포넌트 Props
 */
export function EventBannerList({ events }: EventBannerListProps) {
  if (events.length === 0) return null;

  return (
    <div className="w-[328px] mx-auto">
      {events.map((event) => (
        <div key={event.id} className="mb-[8px]">
          <EventBannerItem event={event} />
        </div>
      ))}
    </div>
  );
} 