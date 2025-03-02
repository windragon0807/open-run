'use client'

import { useState } from 'react'
import { RegularAchievementType } from '@/types/achievement'

/**
 * 도전과제 아코디언 컴포넌트 Props
 */
interface AchievementAccordionProps {
  title: string
  achievements: RegularAchievementType[]
}

/**
 * 도전과제 아코디언 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export function AchievementAccordion({ title, achievements }: AchievementAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 bg-gray-100 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <span className="px-2 py-1 bg-gray-300 rounded-full text-sm mr-2">일반</span>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>
      
      {isOpen && (
        <div className="p-4 bg-white">
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <h4 className="font-medium">{achievement.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                {achievement.reward && (
                  <p className="text-sm mt-2">
                    보상: {achievement.reward.type} {achievement.reward.amount}
                  </p>
                )}
                <div className="mt-2 text-sm">
                  <span className={`px-2 py-1 rounded-full ${
                    achievement.status === '완료' 
                      ? 'bg-green-100 text-green-700' 
                      : achievement.status === '진행중' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-700'
                  }`}>
                    {achievement.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 