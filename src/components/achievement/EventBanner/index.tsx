'use client'

import { EventAchievementType } from '@/types/achievement'
import { EventBannerList } from './EventBannerList'
import { EventBannerSlider } from './EventBannerSlider'

// 개별 컴포넌트들을 export
export { EventBannerItem } from './EventBannerItem'
export { EventBannerSlider } from './EventBannerSlider'
export { EventBannerList } from './EventBannerList'
export { EventBannerListItem } from './EventBannerListItem'
export { SubChallengeItem } from './SubChallengeItem'

// 타입들을 export
export type { EventBannerListProps, EventBannerListItemProps, SubChallengeItemProps } from './types'
export type { SubChallenge } from './utils'

// 유틸리티 함수들을 export
export { getSubChallenges } from './utils'

// 상수들을 export
export { ENDING_SOON_DAYS_BEFORE, COMPLETED_EVENT_OPACITY } from './constants'

/**
 * 이벤트 배너 Props
 */
export interface EventBannerProps {
  /** 이벤트 도전과제 목록 */
  eventAchievements: EventAchievementType[]
  /** 표시 모드 */
  mode: 'slider' | 'list'
  /** 클릭 이벤트 핸들러 */
  onEventClick?: (event: EventAchievementType) => void
}

/**
 * 이벤트 배너 컴포넌트
 * mode에 따라 슬라이더 또는 리스트 형태로 표시됩니다.
 *
 * @param props - 컴포넌트 Props
 */
export default function EventBanner({ eventAchievements, mode, onEventClick }: EventBannerProps) {
  if (mode === 'slider') {
    return <EventBannerSlider eventAchievements={eventAchievements} />
  }

  return <EventBannerList eventAchievements={eventAchievements} onEventClick={onEventClick} />
}
