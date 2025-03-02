'use client'

import { useState } from 'react'
import { EventAchievementType } from '@/types/achievement'

/**
 * 이벤트 도전과제 카드 컴포넌트 Props
 */
interface EventAchievementCardProps {
  achievement: EventAchievementType
}

/**
 * 이벤트 도전과제 카드 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export function EventAchievementCard({ achievement }: EventAchievementCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="w-64 p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center">
        <span className="px-2 py-1 bg-gray-300 rounded-full text-sm mr-2">이벤트</span>
        <h3 className="font-semibold truncate">{achievement.title}</h3>
      </div>
      <button 
        className="mt-4 w-full flex justify-end"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>{isExpanded ? '▲' : '▼'}</span>
      </button>
      
      {isExpanded && (
        <div className="mt-2 pt-2 border-t">
          <p className="text-sm">{achievement.description}</p>
          <p className="text-sm mt-2">
            {achievement.startDate} ~ {achievement.endDate}
          </p>
          {achievement.reward && (
            <p className="text-sm mt-2">
              보상: {achievement.reward.type} {achievement.reward.amount}
            </p>
          )}
        </div>
      )}
    </div>
  )
} 