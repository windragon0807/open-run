'use client'

import { RegularAchievementType } from '@/types/achievement'
import { AchievementAccordion } from './AchievementAccordion'

/**
 * 일반 도전과제 컴포넌트 Props
 */
interface RegularAchievementsClientProps {
  achievements: RegularAchievementType[]
}

/**
 * 일반 도전과제 클라이언트 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export function RegularAchievementsClient({ achievements }: RegularAchievementsClientProps) {
  // 그룹별로 도전과제 정리
  const groupedAchievements = achievements.reduce<Record<string, RegularAchievementType[]>>(
    (groups, achievement) => {
      const group = achievement.group
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(achievement)
      return groups
    }, 
    {}
  )

  return (
    <div className="space-y-4">
      {Object.entries(groupedAchievements).map(([group, achievements]) => (
        <AchievementAccordion 
          key={group} 
          title={group} 
          achievements={achievements} 
        />
      ))}
    </div>
  )
} 