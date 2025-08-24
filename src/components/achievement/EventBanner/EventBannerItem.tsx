'use client'

import { EventAchievementType } from '@type/achievement'
import { AchievementButton, AchievementButtonType } from '../buttons'
import { ProgressBar } from '../buttons'

/**
 * 이벤트 배너 아이템 Props
 */
export interface EventBannerItemProps {
  /** 이벤트 도전과제 */
  event: EventAchievementType
  /** 클릭 이벤트 핸들러 */
  onClick?: (event: EventAchievementType) => void
  /** 추가 CSS 클래스 */
  className?: string
}

/**
 * 이벤트 배너 아이템 컴포넌트
 *
 * @param props - 컴포넌트 Props
 */
export function EventBannerItem({ event, onClick, className = '' }: EventBannerItemProps) {
  const isCompleted = event.status === '완료'
  const isPending = event.status === '진행중'

  /**
   * 버튼 타입 결정 함수
   */
  const getButtonType = (): AchievementButtonType => {
    if (isCompleted) return 'completed'
    if (isPending) return 'progress'
    return 'reward'
  }

  /**
   * 이벤트 배너 클릭 핸들러
   */
  const handleClick = () => {
    if (onClick) onClick(event)
  }

  return (
    <div
      className={`relative flex h-[134px] w-full rounded-[10px] bg-[#ADB5BD] shadow-floating-primary transition-all duration-300 ${isCompleted ? 'opacity-60' : ''} ${className}`}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}>
      {/* 이벤트 이미지 */}
      <div
        className='my-[30px] ml-[16px] h-[60px] w-[60px] rounded-[10px] bg-[#DEE2E6] transition-transform duration-300'
        style={{
          backgroundSize: 'cover',
          backgroundImage: event.imageUrl ? `url(${event.imageUrl})` : 'none',
          backgroundPosition: 'center',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}></div>

      {/* 이벤트 콘텐츠 영역 */}
      <div className='relative ml-[8px] flex-1'>
        {/* 이벤트 제목과 설명 */}
        <div className='mt-[22px]'>
          {/* 이벤트 주제 */}
          <h3 className='max-w-[160px] truncate text-[12px] font-medium leading-[16px] tracking-[-0.02em] text-[#666666] transition-opacity duration-300'>
            {event.theme}
          </h3>

          {/* 이벤트 제목 */}
          <h4 className='max-w-[160px] truncate text-[14px] font-bold leading-[20px] tracking-[-0.02em] text-[#222222] transition-opacity duration-300'>
            {event.title}
          </h4>

          <p className='max-w-[160px] truncate text-[12px] font-normal leading-[16px] tracking-[-0.02em] text-[#222222] transition-opacity duration-300'>
            {event.description}
          </p>
        </div>

        {/* 하단 정보 영역 */}
        <div className='absolute bottom-[16px] left-0 right-[16px] flex items-center justify-between'>
          <div className='mr-[11px] flex-1'>
            {/* 진행도 표시 선 */}
            <ProgressBar current={event.progress?.current || 0} total={event.progress?.total || 1} width='100%' />

            {/* 이벤트 기간 (종료일만 표시) */}
            <p className='mt-[12px] text-[12px] font-normal leading-[16px] tracking-[-0.02em] text-[#222222] transition-opacity duration-300'>
              ~ {event.endDate}
            </p>
          </div>

          {/* 버튼 (달성도 우측 11px, 배너 하단 16px) */}
          <AchievementButton
            type={getButtonType()}
            status={event.status}
            current={event.progress?.current}
            total={event.progress?.total}
          />
        </div>
      </div>
    </div>
  )
}
