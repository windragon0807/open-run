'use client'

import { AchievementStatus } from '@/types/achievement'

/**
 * 도전과제 버튼 타입
 */
export type AchievementButtonType = 'reward' | 'progress' | 'completed'

/**
 * 도전과제 버튼 Props
 */
interface AchievementButtonProps {
  /** 버튼 타입 */
  type?: AchievementButtonType
  /** 도전과제 상태 */
  status: AchievementStatus
  /** 현재 진행도 (진행 중인 경우에만 사용) */
  current?: number
  /** 목표 진행도 (진행 중인 경우에만 사용) */
  total?: number
  /** 버튼 클릭 이벤트 핸들러 */
  onClick?: () => void
  /** 버튼 텍스트 (기본값은 타입에 따라 결정) */
  text?: string
  /** 추가 클래스명 */
  className?: string
}

/**
 * 도전과제 버튼 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export function AchievementButton({ 
  type, 
  status, 
  current = 0, 
  total = 1, 
  onClick, 
  text,
  className = ''
}: AchievementButtonProps) {
  // 상태에 따라 자동으로 버튼 타입 결정
  const buttonType = type || (
    status === '완료' ? 'completed' : 
    status === '진행중' ? 'progress' : 'reward'
  )

  /**
   * 버튼 텍스트 결정 함수
   */
  const getButtonText = (): string => {
    if (text) return text;
    
    if (buttonType === 'completed') return '완료';
    if (buttonType === 'progress') return `${current}/${total}`;
    return '보상 받기';
  };
  
  /**
   * 버튼 스타일 클래스 결정 함수
   */
  const getButtonClass = (): string => {
    const baseStyle = "w-[60px] h-[30px] rounded-[8px] font-bold text-[12px] leading-[16px] tracking-[-0.02em] text-center";
    
    if (buttonType === 'completed') {
      return `${baseStyle} bg-[#DEE2E6] text-[#89939D] ${className}`;
    } else if (buttonType === 'progress') {
      return `${baseStyle} bg-[#89939D] text-[#F8F9FA] ${className}`;
    } else { // 'reward'
      return `${baseStyle} bg-[#4A5CEF] text-white ${className}`;
    }
  };

  return (
    <button 
      className={getButtonClass()}
      onClick={onClick}
      disabled={buttonType === 'completed'}
      type="button"
    >
      {getButtonText()}
    </button>
  );
} 