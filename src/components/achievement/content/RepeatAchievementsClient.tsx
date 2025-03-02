'use client'

import { RepeatAchievementType } from '@/types/achievement'

/**
 * 반복 도전과제 컴포넌트 Props
 */
interface RepeatAchievementsClientProps {
  achievements: RepeatAchievementType[]
}

/**
 * 반복 도전과제 클라이언트 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export function RepeatAchievementsClient({ achievements }: RepeatAchievementsClientProps) {
  return (
    <div className="space-y-4">
      {achievements.map((achievement) => (
        <div key={achievement.id} className="p-4 bg-gray-100 rounded-lg">
          <div className="flex items-center">
            <span className="px-2 py-1 bg-gray-300 rounded-full text-sm mr-2">반복</span>
            <h3 className="font-semibold">{achievement.title}</h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">{achievement.description}</p>
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span>진행도 ({achievement.progress.current}/{achievement.progress.total})</span>
              <span>{Math.round((achievement.progress.current / achievement.progress.total) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(achievement.progress.current / achievement.progress.total) * 100}%` }}
              ></div>
            </div>
          </div>
          {achievement.reward && (
            <p className="text-sm mt-2">
              보상: {achievement.reward.type} {achievement.reward.amount}
            </p>
          )}
        </div>
      ))}
    </div>
  )
} 