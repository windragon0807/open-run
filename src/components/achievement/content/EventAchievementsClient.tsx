'use client'

import { EventAchievementType } from '@/types/achievement'
import EventBanner from '../EventBanner'

/**
 * 이벤트 도전과제 컴포넌트 Props
 */
interface EventAchievementsClientProps {
  achievements: EventAchievementType[]
}

/**
 * 이벤트 도전과제 클라이언트 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export function EventAchievementsClient({ achievements }: EventAchievementsClientProps) {
  return (
    <div className="space-y-4">
      <EventBanner eventAchievements={achievements} />
    </div>
  )
} 