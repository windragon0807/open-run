'use client'

import { useState } from 'react'
import { EventAchievementType } from '@type/achievement'

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
    <div className='bg-gray-100 w-64 rounded-lg p-4'>
      <div className='flex items-center'>
        <span className='bg-gray-300 text-sm mr-2 rounded-full px-2 py-1'>이벤트</span>
        <h3 className='truncate font-semibold'>{achievement.title}</h3>
      </div>
      <button className='mt-4 flex w-full justify-end' onClick={() => setIsExpanded(!isExpanded)}>
        <span>{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div className='mt-2 border-t pt-2'>
          <p className='text-sm'>{achievement.description}</p>
          <p className='text-sm mt-2'>
            {achievement.startDate} ~ {achievement.endDate}
          </p>
          {achievement.reward && (
            <p className='text-sm mt-2'>
              보상: {achievement.reward.type} {achievement.reward.amount}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
