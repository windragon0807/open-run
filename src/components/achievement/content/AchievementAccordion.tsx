'use client'

import { useState } from 'react'
import { RegularAchievementType } from '@type/achievement'

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
    <div className='overflow-hidden rounded-lg border'>
      <div
        className='bg-gray-100 flex cursor-pointer items-center justify-between p-4'
        onClick={() => setIsOpen(!isOpen)}>
        <div className='flex items-center'>
          <span className='bg-gray-300 text-sm mr-2 rounded-full px-2 py-1'>일반</span>
          <h3 className='font-semibold'>{title}</h3>
        </div>
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className='bg-white p-4'>
          <div className='space-y-4'>
            {achievements.map((achievement) => (
              <div key={achievement.id} className='border-b pb-4 last:border-b-0 last:pb-0'>
                <h4 className='font-medium'>{achievement.title}</h4>
                <p className='text-sm text-gray-600 mt-1'>{achievement.description}</p>
                {achievement.reward && (
                  <p className='text-sm mt-2'>
                    보상: {achievement.reward.type} {achievement.reward.amount}
                  </p>
                )}
                <div className='text-sm mt-2'>
                  <span
                    className={`rounded-full px-2 py-1 ${
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
