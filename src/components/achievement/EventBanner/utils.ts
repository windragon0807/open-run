import { EventAchievementType } from '@/types/achievement'
import type { AchievementStatus } from '@/types/achievement'

/**
 * 서브 도전과제 타입
 */
export interface SubChallenge {
  id: string
  theme: string
  title: string
  description: string
  progress: { current: number; total: number }
  status: AchievementStatus
  imageUrl?: string
}

/**
 * 이벤트별 서브 도전과제 데이터 생성
 */
export const getSubChallenges = (event: EventAchievementType): SubChallenge[] => {
  if (event.theme === '[2024 크리스마스]') {
    return [
      {
        id: '1',
        theme: event.theme,
        title: '루돌프 선물배달 작전',
        description: '이벤트 NFT 장착하고 성당 근처에서 달리기',
        progress: { current: 1, total: 1 },
        status: '완료' as AchievementStatus,
        imageUrl: event.imageUrl,
      },
      {
        id: '2',
        theme: event.theme,
        title: '이벤트 NFT 컬렉터',
        description: '모든 NFT를 모아보자!',
        progress: { current: 1, total: 1 },
        status: '완료' as AchievementStatus,
      },
      {
        id: '3',
        theme: event.theme,
        title: '오늘부터 내가 루돌프',
        description: '이벤트 첫 출석보상',
        progress: { current: 1, total: 1 },
        status: '완료' as AchievementStatus,
      },
    ]
  } else if (event.theme === '[2025 신년]') {
    return [
      {
        id: '1',
        theme: event.theme,
        title: '새해 첫 달리기',
        description: '2025년 첫 러닝을 완주하세요',
        progress: { current: 1, total: 1 },
        status: '완료' as AchievementStatus,
        imageUrl: event.imageUrl,
      },
      {
        id: '2',
        theme: event.theme,
        title: '신년 다짐 세우기',
        description: '올해의 목표를 설정해보세요',
        progress: { current: 0, total: 1 },
        status: '진행중' as AchievementStatus,
      },
      {
        id: '3',
        theme: event.theme,
        title: '새해 인사하기',
        description: '친구들에게 새해 인사를 전하세요',
        progress: { current: 0, total: 1 },
        status: '진행중' as AchievementStatus,
      },
    ]
  } else {
    // 기본 서브 도전과제
    return [
      {
        id: '1',
        theme: event.theme,
        title: event.title,
        description: event.description,
        progress: { current: event.progress?.current || 0, total: event.progress?.total || 1 },
        status: event.status,
        imageUrl: event.imageUrl,
      },
    ]
  }
}
