'use client'

import { 
  RegularAchievementType, 
  RepeatAchievementType, 
  EventAchievementType 
} from '@/types/achievement'
import { RegularAchievementsClient } from './RegularAchievementsClient'
import { RepeatAchievementsClient } from './RepeatAchievementsClient'
import EventBanner from '../EventBanner'

/**
 * 전체 도전과제 컴포넌트 Props
 */
interface AllAchievementsClientProps {
  regularAchievements: RegularAchievementType[]
  repeatAchievements: RepeatAchievementType[]
  eventAchievements: EventAchievementType[]
}

/**
 * 전체 도전과제 클라이언트 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export function AllAchievementsClient({ 
  regularAchievements, 
  repeatAchievements, 
  eventAchievements 
}: AllAchievementsClientProps) {
  return (
    <div>
      {/* 이벤트 배너 */}
      <EventBanner eventAchievements={eventAchievements} mode="slider" />
      
      {/* 일반 도전과제 (아코디언) */}
      <div className="mb-6 mt-6">
        <RegularAchievementsClient achievements={regularAchievements} />
      </div>
      
      {/* 반복 도전과제 */}
      <div>
        <RepeatAchievementsClient achievements={repeatAchievements} />
      </div>
    </div>
  )
} 