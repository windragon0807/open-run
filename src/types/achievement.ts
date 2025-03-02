/**
 * 도전과제 카테고리 타입
 */
export type AchievementCategory = '일반' | '반복' | '이벤트'

/**
 * 도전과제 상태 타입
 */
export type AchievementStatus = '진행중' | '완료' | '대기중'

/**
 * 기본 도전과제 인터페이스
 */
export interface BaseAchievementType {
  /** 도전과제 고유 ID */
  id: string
  /** 도전과제 제목 */
  title: string
  /** 도전과제 설명 */
  description: string
  /** 도전과제 카테고리 */
  category: AchievementCategory
  /** 도전과제 현재 상태 */
  status: AchievementStatus
  /** 보상 정보 */
  reward?: {
    /** 보상 타입 (예: 포인트, 아이템 등) */
    type: string
    /** 보상 수량 */
    amount: number
  }
}

/**
 * 일반 도전과제 타입
 */
export interface RegularAchievementType extends BaseAchievementType {
  category: '일반'
  /** 도전과제 그룹 (예: 출석 과제, 친구 초대 등) */
  group: string
}

/**
 * 반복 도전과제 타입
 */
export interface RepeatAchievementType extends BaseAchievementType {
  category: '반복'
  /** 반복 주기 (예: 일간, 주간, 월간) */
  cycle: '일간' | '주간' | '월간'
  /** 달성 진행도 */
  progress: {
    /** 현재 달성 횟수 */
    current: number
    /** 목표 달성 횟수 */
    total: number
  }
}

/**
 * 이벤트 도전과제 타입
 */
export interface EventAchievementType extends BaseAchievementType {
  category: '이벤트'
  /** 이벤트 시작 날짜 */
  startDate: string
  /** 이벤트 종료 날짜 */
  endDate: string
  /** 이벤트 이미지 URL */
  imageUrl?: string
  /** 달성 진행도 */
  progress?: {
    /** 현재 달성 횟수 */
    current: number
    /** 목표 달성 횟수 */
    total: number
  }
}

/**
 * 도전과제 유니온 타입
 */
export type AchievementType = RegularAchievementType | RepeatAchievementType | EventAchievementType 