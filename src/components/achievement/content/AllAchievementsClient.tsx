'use client'

import { useEffect } from 'react'
import { useAchievementStore } from '@/store/achievement'
import RegularAchievementsClient from './RegularAchievementsClient'
import RepeatAchievementsClient from './RepeatAchievementsClient'
import EventBanner from '../EventBanner'
import { AchievementBanner } from '../AchievementBanner'

/**
 * 도전과제 상태에 따른 정렬 우선순위
 */
type StatusOrder = {
  '진행중': number;
  '대기중': number;
  '완료': number;
  [key: string]: number;
}

/**
 * 전체 도전과제 클라이언트 컴포넌트
 * 
 * @returns 전체 도전과제 클라이언트 컴포넌트
 */
export default function AllAchievementsClient() {
  const { 
    fetchAchievements, 
    eventAchievements,
    regularAchievements,
    repeatAchievements, 
    isLoading 
  } = useAchievementStore()

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  if (isLoading) {
    return <div className="flex justify-center p-5">전체 도전과제 로딩 중...</div>
  }

  return (
    <div>
      {/* 이벤트 배너 */}
      <div className="flex justify-center mb-5">
        <div className="max-w-[328px] w-full">
          <EventBanner eventAchievements={eventAchievements} mode="slider" />
        </div>
      </div>
      
      {/* 모든 도전과제를 하나의 컨테이너로 통합 */}
      <div className="flex flex-col items-center">
        {/* 일반 도전과제와 반복 도전과제 사이에 정확히 12px 간격을 적용 */}
        <div className="flex flex-col items-center space-y-[12px] p-5 mt-[20px]">
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
    const statusOrder: StatusOrder = { '진행중': 0, '대기중': 1, '완료': 2 };
    return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
  });
  
  return (
    <>
      {sortedAchievements.map(achievement => (
        <div key={achievement.id} className="w-full max-w-[328px]">
          <AchievementBanner
            id={achievement.id}
            title={achievement.title}
            description={achievement.description}
            labelType="일반"
            status={achievement.status}
            details={
              <div className="space-y-2">
                <p className="text-sm text-gray-700">{achievement.description}</p>
                {achievement.reward && (
                  <p className="text-sm font-medium">
                    보상: {achievement.reward.type} {achievement.reward.amount}
                  </p>
                )}
              </div>
            }
            className="max-w-[328px] w-full"
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
    const statusOrder: StatusOrder = { '진행중': 0, '대기중': 1, '완료': 2 };
    return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
  });
  
  return (
    <>
      {sortedAchievements.map(achievement => (
        <div key={achievement.id} className="w-full max-w-[328px]">
          <AchievementBanner
            key={achievement.id}
            id={achievement.id}
            title={achievement.title}
            description={achievement.description}
            labelType="반복"
            status={achievement.status}
            details={
              <div className="space-y-2">
                <p className="text-sm text-gray-700">{achievement.description}</p>
                
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
                  <p className="text-sm font-medium mt-2">
                    보상: {achievement.reward.type} {achievement.reward.amount}
                  </p>
                )}
                
                {achievement.cycle && (
                  <p className="text-xs text-gray-500 mt-1">
                    사이클: {achievement.cycle}
                  </p>
                )}
              </div>
            }
            className="max-w-[328px] w-full"
          />
        </div>
      ))}
    </>
  )
} 