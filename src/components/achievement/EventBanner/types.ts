import { EventAchievementType } from '@/types/achievement'
import type { AchievementStatus } from '@/types/achievement'

/**
 * 이벤트 배너 리스트 Props
 */
export interface EventBannerListProps {
  /** 이벤트 도전과제 목록 */
  eventAchievements: EventAchievementType[]
  /** 클릭 이벤트 핸들러 */
  onEventClick?: (event: EventAchievementType) => void
}

/**
 * 개별 이벤트 배너 아이템 Props
 */
export interface EventBannerListItemProps {
  /** 이벤트 도전과제 */
  event: EventAchievementType
  /** 펼쳐짐 상태 */
  isExpanded: boolean
  /** 펼치기/접기 핸들러 */
  onToggle: () => void
  /** 클릭 이벤트 핸들러 */
  onEventClick?: (event: EventAchievementType) => void
}

/**
 * 서브 도전과제 아이템 Props
 */
export interface SubChallengeItemProps {
  /** 서브 도전과제 */
  challenge: {
    id: string
    theme: string
    title: string
    description: string
    progress: { current: number; total: number }
    status: AchievementStatus
    imageUrl?: string
  }
  /** 클릭 이벤트 핸들러 */
  onChallengeClick?: (challenge: any) => void
}
