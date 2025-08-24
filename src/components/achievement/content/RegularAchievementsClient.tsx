'use client'

import { useEffect } from 'react'
import { useAchievementStore } from '@store/achievement'
import { AchievementBanner } from '../AchievementBanner'

/**
 * 일반 도전과제 클라이언트 컴포넌트 Props
 */
interface RegularAchievementsClientProps {
  /** 전체 탭에서 사용되는지 여부 */
  isInAllTab?: boolean
}

/**
 * 일반 도전과제 클라이언트 컴포넌트
 *
 * @param props - 컴포넌트 Props
 * @returns 일반 도전과제 클라이언트 컴포넌트
 */
export default function RegularAchievementsClient({ isInAllTab = false }: RegularAchievementsClientProps) {
  const { fetchAchievements, regularAchievements, isLoading } = useAchievementStore()

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  if (isLoading) {
    return <div className='flex justify-center p-5'>일반 도전과제 로딩 중...</div>
  }

  // 그룹별로 도전과제 모음
  const achievements = regularAchievements.sort((a, b) => {
    // 상태별 정렬: 진행중 > 대기중 > 완료
    const statusOrder = { 진행중: 0, 대기중: 1, 완료: 2 }
    return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0)
  })

  return (
    <div className={`mt-[20px] flex flex-col items-center space-y-[12px] p-5 px-16 ${isInAllTab ? 'pb-0' : ''}`}>
      {achievements.map((achievement) => (
        <AchievementBanner
          key={achievement.id}
          id={achievement.id}
          title={achievement.title}
          description={achievement.description}
          labelType='일반'
          status={achievement.status}
          details={
            <div className='space-y-2'>
              <p className='text-sm text-gray-700'>{achievement.description}</p>
              {achievement.reward && (
                <p className='text-sm font-medium'>
                  보상: {achievement.reward.type} {achievement.reward.amount}
                </p>
              )}
            </div>
          }
          className='w-full'
        />
      ))}

      {regularAchievements.length === 0 && (
        <div className='text-gray-500 py-4 text-center'>일반 도전과제가 없습니다.</div>
      )}
    </div>
  )
}
