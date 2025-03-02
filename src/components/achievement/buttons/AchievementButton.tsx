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
  type: AchievementButtonType
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
  text 
}: AchievementButtonProps) {
  /**
   * 버튼 텍스트 결정 함수
   */
  const getButtonText = (): string => {
    if (text) return text;
    
    if (type === 'completed') return '완료';
    if (type === 'progress') return `${current}/${total}`;
    return '보상 받기';
  };
  
  /**
   * 버튼 스타일 클래스 결정 함수
   */
  const getButtonClass = (): string => {
    const baseStyle = "absolute bottom-[16px] right-[16px] w-[60px] h-[40px] rounded-[8px] font-bold text-[12px] leading-[16px] tracking-[-0.02em] text-center";
    
    if (type === 'completed') {
      return `${baseStyle} bg-[#DEE2E6] text-[#89939D]`;
    } else if (type === 'progress') {
      return `${baseStyle} bg-[#89939D] text-[#F8F9FA]`;
    } else { // 'reward'
      return `${baseStyle} bg-[#4A5CEF] text-white`;
    }
  };

  return (
    <button 
      className={getButtonClass()}
      onClick={onClick}
      disabled={type === 'completed'}
    >
      {getButtonText()}
    </button>
  );
} 