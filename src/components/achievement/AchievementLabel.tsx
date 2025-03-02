'use client'

/**
 * 도전과제 라벨 타입
 */
export type AchievementLabelType = '이벤트' | '일반' | '반복'

/**
 * 도전과제 라벨 컴포넌트 Props
 */
interface AchievementLabelProps {
  /** 라벨 타입 */
  type: AchievementLabelType
  /** 추가 클래스명 */
  className?: string
}

/**
 * 도전과제 라벨 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 * @returns 도전과제 라벨 컴포넌트
 */
export function AchievementLabel({ type, className = '' }: AchievementLabelProps) {
  return (
    <span 
      className={`inline-flex items-center justify-center w-[47px] h-[24px] rounded-[25px] bg-[#DEE2E6] 
      font-normal text-xs leading-4 tracking-[-2%] text-center ${className}`}
    >
      {type}
    </span>
  )
} 