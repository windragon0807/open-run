'use client'

import { useAchievementStore } from '@/store/achievement'
import { useEffect } from 'react'
import { AchievementBanner } from '../AchievementBanner'
import EventBanner from '../EventBanner'
import RegularAchievementsClient from './RegularAchievementsClient'
import RepeatAchievementsClient from './RepeatAchievementsClient'

/**
 * 도전과제 상태에 따른 정렬 우선순위
 */
type StatusOrder = {
  진행중: number
  대기중: number
  완료: number
  [key: string]: number
}

/**
 * 전체 도전과제 클라이언트 컴포넌트
 *
 * @returns 전체 도전과제 클라이언트 컴포넌트
 */
export default function AllAchievementsClient() {
  const { fetchAchievements, eventAchievements, regularAchievements, repeatAchievements, isLoading } =
    useAchievementStore()

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  if (isLoading) {
    return <div className='flex justify-center p-5'>전체 도전과제 로딩 중...</div>
  }

  return (
    <div>
      {/* 이벤트 배너 */}
      <div className='mb-5 flex justify-center'>
        <div className='w-full max-w-[328px]'>
          <EventBanner eventAchievements={eventAchievements} mode='slider' />
        </div>
      </div>

      {/* 모든 도전과제를 하나의 컨테이너로 통합 */}
      <div className='flex flex-col items-center'>
        <div className='mt-[20px] flex flex-col items-center space-y-[12px] p-5'>
          <RegularAchievementsList achievements={regularAchievements} />
          <RepeatAchievementsList achievements={repeatAchievements} />
        </div>
      </div>
    </div>
  )
}

/**
 * 일반 도전과제 리스트 컴포넌트
 */
function RegularAchievementsList({ achievements }: { achievements: any[] }) {
  // 상태별 정렬
  const sortedAchievements = achievements.sort((a, b) => {
    // 상태별 정렬: 진행중 > 대기중 > 완료
    const statusOrder: StatusOrder = { 진행중: 0, 대기중: 1, 완료: 2 }
    return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0)
  })

  return (
    <>
      {sortedAchievements.map((achievement) => (
        <div key={achievement.id} className='w-full max-w-[328px]'>
          <AchievementBanner
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
            className='w-full max-w-[328px]'
          />
        </div>
      ))}
    </>
  )
}

/**
 * 반복 도전과제 리스트 컴포넌트
 */
function RepeatAchievementsList({ achievements }: { achievements: any[] }) {
  // 상태별 정렬
  const sortedAchievements = achievements.sort((a, b) => {
    // 상태별 정렬: 진행중 > 대기중 > 완료
    const statusOrder: StatusOrder = { 진행중: 0, 대기중: 1, 완료: 2 }
    return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0)
  })

  return (
    <>
      {sortedAchievements.map((achievement) => (
        <div key={achievement.id} className='w-full max-w-[328px]'>
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
            className='w-full max-w-[328px]'
          />
        </div>
      ))}
    </>
  )
}
