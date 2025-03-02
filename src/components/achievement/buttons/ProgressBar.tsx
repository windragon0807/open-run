'use client'

import { CSSProperties } from 'react';

/**
 * 진행도 바 Props
 */
interface ProgressBarProps {
  /** 현재 진행도 */
  current: number
  /** 목표 진행도 */
  total: number
  /** 배경색 (기본: #DEE2E6) */
  backgroundColor?: string
  /** 진행도 색상 (기본: #222222) */
  progressColor?: string
  /** 높이 (기본: 3px) */
  height?: string
  /** 너비 (기본: 157px) */
  width?: string
  /** 절대 위치 (기본: 없음) */
  position?: {
    left?: string
    right?: string
    top?: string
    bottom?: string
  }
  /** 추가 스타일 클래스 */
  className?: string
}

/**
 * 진행도 바 컴포넌트
 * 
 * @param props - 컴포넌트 Props
 */
export function ProgressBar({ 
  current, 
  total, 
  backgroundColor = '#DEE2E6',
  progressColor = '#222222',
  height = '3px',
  width = '157px',
  position,
  className = ''
}: ProgressBarProps) {
  // 진행도 퍼센트 계산
  const progressPercent = (current / total) * 100;
  
  // 위치 스타일 생성
  const positionStyle: CSSProperties = position ? {
    position: 'absolute',
    left: position.left,
    right: position.right,
    top: position.top,
    bottom: position.bottom
  } : {};
  
  return (
    <div 
      className={className}
      style={{
        width,
        height,
        backgroundColor,
        ...positionStyle
      }}
    >
      <div 
        style={{
          height: '100%',
          width: `${progressPercent}%`,
          backgroundColor: progressColor
        }}
      ></div>
    </div>
  );
} 