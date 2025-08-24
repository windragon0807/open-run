'use client'

import { useEffect } from 'react'
import { useAchievementStore } from '@store/achievement'
import { AchievementBanner } from '../AchievementBanner'

/**
 * 반복 도전과제 클라이언트 컴포넌트 Props
 */
interface RepeatAchievementsClientProps {
  /** 전체 탭에서 사용되는지 여부 */
  isInAllTab?: boolean
}

/**
 * 반복 도전과제 클라이언트 컴포넌트
 *
 * @param props - 컴포넌트 Props
 * @returns 반복 도전과제 클라이언트 컴포넌트
 */
export default function RepeatAchievementsClient({ isInAllTab = false }: RepeatAchievementsClientProps) {
  const { fetchAchievements, repeatAchievements, isLoading } = useAchievementStore()

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  if (isLoading) {
    return <div className='flex justify-center p-5'>반복 도전과제 로딩 중...</div>
  }

  // 상태별 정렬
  const achievements = repeatAchievements.sort((a, b) => {
    // 상태별 정렬: 진행중 > 대기중 > 완료
    const statusOrder = { 진행중: 0, 대기중: 1, 완료: 2 }
    return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0)
  })

  return (
    <div className={`flex flex-col items-center space-y-[12px] p-5 px-16 ${isInAllTab ? 'mt-0 pt-0' : 'mt-[20px]'}`}>
      {achievements.map((achievement) => (
        <AchievementBanner
          key={achievement.id}
          id={achievement.id}
          title={achievement.title}
          description={achievement.description}
          labelType='반복'
          status={achievement.status}
          details={
            <div className='space-y-2'>
              <p className='text-sm text-gray-700'>{achievement.description}</p>

              <div className='mt-3'>
                <div className='text-sm mb-1 flex justify-between'>
                  <span>
                    진행도 ({achievement.progress.current}/{achievement.progress.total})
                  </span>
                  <span>{Math.round((achievement.progress.current / achievement.progress.total) * 100)}%</span>
                </div>
                <div className='bg-gray-200 h-2.5 w-full rounded-full'>
                  <div
                    className='bg-blue-600 h-2.5 rounded-full'
                    style={{ width: `${(achievement.progress.current / achievement.progress.total) * 100}%` }}></div>
                </div>
              </div>

              {achievement.reward && (
                <p className='text-sm mt-2 font-medium'>
                  보상: {achievement.reward.type} {achievement.reward.amount}
                </p>
              )}

              {achievement.cycle && <p className='text-xs text-gray-500 mt-1'>사이클: {achievement.cycle}</p>}
            </div>
          }
          className='w-full'
        />
      ))}

      {repeatAchievements.length === 0 && (
        <div className='text-gray-500 py-4 text-center'>반복 도전과제가 없습니다.</div>
      )}
    </div>
  )
}
